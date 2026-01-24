from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import asyncio
import resend
import qrcode
from io import BytesIO
import base64
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import razorpay

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend Email Setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Razorpay Setup
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

# JWT Setup
JWT_SECRET = os.environ.get('JWT_SECRET', 'star_marketing_secret_key_2025')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
# security = HTTPBearer()
security = HTTPBearer(auto_error=False)

from fastapi.middleware.cors import CORSMiddleware


# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    phone: str
    role: str = "member"   # ✅ by default member
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    # ❌ role remove kar diya


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Member(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    member_number: str
    designation: str
    designation_fee: float
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    photo_url: Optional[str] = None
    referrer_id: Optional[str] = None
    status: str = "pending"  # pending, approved, blocked
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Donation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    donor_name: str
    donor_email: EmailStr
    donor_phone: str
    amount: float
    payment_method: str  # online, cash, bank_transfer
    payment_id: Optional[str] = None
    order_id: Optional[str] = None
    status: str = "pending"  # pending, completed, failed
    receipt_number: str
    purpose: Optional[str] = None
    referrer_member_id: Optional[str] = None
    campaign_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_80g_eligible: bool = True

class Certificate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    certificate_type: str  # member, visitor, achievement
    recipient_name: str
    recipient_email: EmailStr
    template_id: str
    certificate_number: str
    issue_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    content: dict  # Contains certificate details
    qr_data: str
    issued_by: str

class Beneficiary(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    address: str
    phone: Optional[str] = None
    category: str  # education, medical, food, clothing, etc.
    description: Optional[str] = None
    help_history: List[dict] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    image_url: Optional[str] = None
    author_id: str
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Activity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    images: List[str] = []
    author_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    goal_amount: float
    current_amount: float = 0.0
    start_date: datetime
    end_date: datetime
    image_url: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: datetime
    location: str
    registration_fee: float = 0.0
    is_paid: bool = False
    max_participants: Optional[int] = None
    registered_count: int = 0
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    budget: float
    spent: float = 0.0
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    status: str = "pending"  # pending, replied
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Internship(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    duration: str
    positions: int
    applications: List[dict] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Designation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    fee: float
    benefits: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPER FUNCTIONS ====================

def generate_qr_code(data: str) -> str:
    """Generate QR code and return as base64 string"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    """Create JWT token"""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def send_email(to: str, subject: str, html_content: str):
    """Send email using Resend"""
    if not RESEND_API_KEY:
        logging.warning("Resend API key not configured, skipping email")
        return
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")

def generate_receipt_number() -> str:
    """Generate unique receipt number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"SM-{timestamp}-{uuid.uuid4().hex[:6].upper()}"

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        phone=user_data.phone,
        role="member",      # ✅ force member
        is_active=False
    )

    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)

    token = create_jwt_token(user.id, user.email, user.role)

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get('is_active', True):
        raise HTTPException(status_code=403, detail="Account is blocked")
    
    token = create_jwt_token(user['id'], user['email'], user['role'])
    return {"token": token, "user": {"id": user['id'], "name": user['name'], "email": user['email'], "role": user['role']}}

@api_router.get("/auth/me")
async def get_current_user(user_data: dict = Depends(verify_token)):
    user = await db.users.find_one({"id": user_data['user_id']}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== MEMBER ROUTES ====================

@api_router.post("/members")
async def create_member(
    member_data: dict,
    user_data: dict = Depends(verify_token)
):
    # Generate member number
    member_count = await db.members.count_documents({})
    member_number = f"SM{str(member_count + 1).zfill(6)}"
    
    member = Member(
        user_id=user_data['user_id'],
        member_number=member_number,
        **member_data
    )
    
    doc = member.model_dump()
    doc['joined_at'] = doc['joined_at'].isoformat()
    await db.members.insert_one(doc)
    
    return {"message": "Membership application submitted", "member_number": member_number}

@api_router.get("/members")
async def get_members(user_data: dict = Depends(verify_token)):
    if user_data['role'] == 'admin':
        members = await db.members.find({}, {"_id": 0}).to_list(1000)
    else:
        members = await db.members.find({"user_id": user_data['user_id']}, {"_id": 0}).to_list(10)
    return members

@api_router.patch("/members/{member_id}/status")
async def update_member_status(
    member_id: str,
    status: str,
    user_data: dict = Depends(verify_token)
):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can update status")
    
    await db.members.update_one({"id": member_id}, {"$set": {"status": status}})
    return {"message": "Status updated"}

# ==================== DONATION ROUTES ====================

@api_router.post("/donations/create-order")
async def create_donation_order(donation_data: dict):
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
    
    amount_in_paise = int(donation_data['amount'] * 100)
    
    razor_order = razorpay_client.order.create({
        "amount": amount_in_paise,
        "currency": "INR",
        "payment_capture": 1
    })
    
    receipt_number = generate_receipt_number()
    
    donation = Donation(
        donor_name=donation_data['donor_name'],
        donor_email=donation_data['donor_email'],
        donor_phone=donation_data['donor_phone'],
        amount=donation_data['amount'],
        payment_method="online",
        order_id=razor_order['id'],
        receipt_number=receipt_number,
        purpose=donation_data.get('purpose'),
        campaign_id=donation_data.get('campaign_id'),
        status="pending"
    )
    
    doc = donation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.donations.insert_one(doc)
    
    return {
        "order_id": razor_order['id'],
        "amount": amount_in_paise,
        "currency": "INR",
        "donation_id": donation.id
    }

@api_router.post("/donations/verify-payment")
async def verify_donation_payment(payment_data: dict):
    donation = await db.donations.find_one({"order_id": payment_data['order_id']}, {"_id": 0})
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    # Update donation status
    await db.donations.update_one(
        {"order_id": payment_data['order_id']},
        {"$set": {"status": "completed", "payment_id": payment_data['payment_id']}}
    )
    
    # Generate QR code for receipt
    qr_data = f"https://starmarketing.in/verify-receipt/{donation['receipt_number']}"
    qr_image = generate_qr_code(qr_data)
    
    # Send receipt email
    html_content = f"""
    <h2>Thank You for Your Donation!</h2>
    <p>Dear {donation['donor_name']},</p>
    <p>We have received your generous donation of ₹{donation['amount']}.</p>
    <p><strong>Receipt Number:</strong> {donation['receipt_number']}</p>
    <p><strong>Payment ID:</strong> {payment_data['payment_id']}</p>
    <p><strong>Date:</strong> {donation['created_at']}</p>
    <p>This donation is eligible for 80G tax benefits.</p>
    <img src="{qr_image}" alt="QR Code" />
    <p>Scan this QR code to verify your receipt.</p>
    <p>Thank you for supporting NVP Welfare Foundation India!</p>
    """
    await send_email(donation['donor_email'], "Donation Receipt - NVP Welfare Foundation", html_content)
    
    return {"message": "Payment verified and receipt sent", "receipt_number": donation['receipt_number']}

@api_router.get("/donations")
async def get_donations(user_data: dict = Depends(verify_token)):
    if user_data['role'] == 'admin':
        donations = await db.donations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        donations = await db.donations.find({"donor_email": user_data['email']}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return donations

# ==================== CERTIFICATE ROUTES ====================

@api_router.post("/certificates")
async def generate_certificate(
    cert_data: dict,
    user_data: dict = Depends(verify_token)
):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can generate certificates")
    
    cert_number = f"CERT-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    qr_data = f"https://starmarketing.in/verify-certificate/{cert_number}"
    
    certificate = Certificate(
        certificate_type=cert_data['certificate_type'],
        recipient_name=cert_data['recipient_name'],
        recipient_email=cert_data['recipient_email'],
        template_id=cert_data.get('template_id', 'default'),
        certificate_number=cert_number,
        content=cert_data.get('content', {}),
        qr_data=qr_data,
        issued_by=user_data['user_id']
    )
    
    doc = certificate.model_dump()
    doc['issue_date'] = doc['issue_date'].isoformat()
    await db.certificates.insert_one(doc)
    
    # Send certificate email
    html_content = f"""
    <h2>Certificate Issued</h2>
    <p>Dear {certificate.recipient_name},</p>
    <p>Your certificate has been issued successfully.</p>
    <p><strong>Certificate Number:</strong> {cert_number}</p>
    <p><strong>Type:</strong> {certificate.certificate_type}</p>
    <p>You can download your certificate from your dashboard.</p>
    """
    await send_email(certificate.recipient_email, "Certificate Issued - NVP Welfare Foundation", html_content)
    
    return {"message": "Certificate generated", "certificate_number": cert_number}

@api_router.get("/certificates")
async def get_certificates(user_data: dict = Depends(verify_token)):
    if user_data['role'] == 'admin':
        certificates = await db.certificates.find({}, {"_id": 0}).to_list(1000)
    else:
        certificates = await db.certificates.find({"recipient_email": user_data['email']}, {"_id": 0}).to_list(100)
    return certificates

@api_router.delete("/certificates/{certificate_id}")
async def delete_certificate(certificate_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete certificates")
    result = await db.certificates.delete_one({"id": certificate_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"message": "Certificate deleted successfully"}

# ==================== NEWS ROUTES ====================

# @api_router.post("/news")
# async def create_news(news_data: dict, user_data: dict = Depends(verify_token)):
#     if user_data['role'] != 'admin':
#         raise HTTPException(status_code=403, detail="Only admins can post news")
    
#     news = News(author_id=user_data['user_id'], **news_data)
#     doc = news.model_dump()
#     doc['created_at'] = doc['created_at'].isoformat()
#     await db.news.insert_one(doc)
#     return {"message": "News published", "id": news.id}

@api_router.post("/news")
async def create_news(news_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can post news")

    # remove author_id if frontend sent it
    news_data.pop("author_id", None)

    news = News(
        **news_data,
        author_id=user_data['user_id']
    )

    doc = news.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.news.insert_one(doc)

    return {"message": "News published", "id": news.id}


@api_router.get("/news")
async def get_news():
    news_list = await db.news.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return news_list

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete news")
    
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}

# ==================== ACTIVITY ROUTES ====================

@api_router.post("/activities")
async def create_activity(activity_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can post activities")
    
    activity = Activity(author_id=user_data['user_id'], **activity_data)
    doc = activity.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.activities.insert_one(doc)
    return {"message": "Activity posted", "id": activity.id}

@api_router.get("/activities")
async def get_activities():
    activities = await db.activities.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return activities

@api_router.delete("/activities/{activity_id}")
async def delete_activity(activity_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete activities")
    
    result = await db.activities.delete_one({"id": activity_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"message": "Activity deleted successfully"}

# ==================== CAMPAIGN ROUTES ====================

@api_router.post("/campaigns")
async def create_campaign(campaign_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create campaigns")
    
    campaign = Campaign(**campaign_data)
    doc = campaign.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['start_date'] = doc['start_date'].isoformat() if isinstance(doc['start_date'], datetime) else doc['start_date']
    doc['end_date'] = doc['end_date'].isoformat() if isinstance(doc['end_date'], datetime) else doc['end_date']
    await db.campaigns.insert_one(doc)
    return {"message": "Campaign created", "id": campaign.id}

@api_router.get("/campaigns")
async def get_campaigns():
    campaigns = await db.campaigns.find({"status": "active"}, {"_id": 0}).to_list(100)
    return campaigns

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete campaigns")
    
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted successfully"}

# ==================== ENQUIRY ROUTES ====================

@api_router.post("/enquiries")
async def create_enquiry(enquiry_data: dict):
    enquiry = Enquiry(**enquiry_data)
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)
    
    # Auto-reply email
    html_content = f"""
    <h2>Thank You for Your Enquiry!</h2>
    <p>Dear {enquiry.name},</p>
    <p>We have received your enquiry and will get back to you soon.</p>
    <p>Your message: {enquiry.message}</p>
    """
    await send_email(enquiry.email, "Enquiry Received - NVP Welfare Foundation", html_content)
    
    return {"message": "Enquiry submitted successfully"}

@api_router.get("/enquiries")
async def get_enquiries(user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can view enquiries")
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return enquiries

@api_router.get("/users/members")
async def get_member_users(user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admin allowed")

    users = await db.users.find(
        {"role": "member"},
        {"_id": 0, "password_hash": 0}
    ).to_list(1000)

    return users

    

# ==================== BENEFICIARY ROUTES ====================

@api_router.post("/beneficiaries")
async def create_beneficiary(beneficiary_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can add beneficiaries")
    
    beneficiary = Beneficiary(**beneficiary_data)
    doc = beneficiary.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.beneficiaries.insert_one(doc)
    return {"message": "Beneficiary added successfully", "id": beneficiary.id}

@api_router.get("/beneficiaries")
async def get_beneficiaries(user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can view beneficiaries")
    beneficiaries = await db.beneficiaries.find({}, {"_id": 0}).to_list(1000)
    return beneficiaries

@api_router.get("/beneficiaries/{beneficiary_id}")
async def get_beneficiary(beneficiary_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can view beneficiaries")
    beneficiary = await db.beneficiaries.find_one({"id": beneficiary_id}, {"_id": 0})
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return beneficiary

@api_router.delete("/beneficiaries/{beneficiary_id}")
async def delete_beneficiary(beneficiary_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete beneficiaries")
    result = await db.beneficiaries.delete_one({"id": beneficiary_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return {"message": "Beneficiary deleted successfully"}

# ==================== EVENT ROUTES ====================

@api_router.post("/events")
async def create_event(event_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create events")
    
    event = Event(**event_data)
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['event_date'] = doc['event_date'].isoformat() if isinstance(doc['event_date'], datetime) else doc['event_date']
    await db.events.insert_one(doc)
    return {"message": "Event created", "id": event.id}

@api_router.get("/events")
async def get_events():
    events = await db.events.find({}, {"_id": 0}).sort("event_date", 1).to_list(100)
    return events

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete events")
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# ==================== PROJECT ROUTES ====================

@api_router.post("/projects")
async def create_project(project_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create projects")
    
    project = Project(**project_data)
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['start_date'] = doc['start_date'].isoformat() if isinstance(doc['start_date'], datetime) else doc['start_date']
    if doc.get('end_date'):
        doc['end_date'] = doc['end_date'].isoformat() if isinstance(doc['end_date'], datetime) else doc['end_date']
    await db.projects.insert_one(doc)
    return {"message": "Project created", "id": project.id}

@api_router.get("/projects")
async def get_projects(user_data: dict = Depends(verify_token)):
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    return projects

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete projects")
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# ==================== INTERNSHIP ROUTES ====================

@api_router.post("/internships")
async def create_internship(internship_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create internships")
    
    internship = Internship(**internship_data)
    doc = internship.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.internships.insert_one(doc)
    return {"message": "Internship created", "id": internship.id}

@api_router.get("/internships")
async def get_internships():
    internships = await db.internships.find({}, {"_id": 0}).to_list(1000)
    return internships

@api_router.delete("/internships/{internship_id}")
async def delete_internship(internship_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete internships")
    result = await db.internships.delete_one({"id": internship_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship deleted successfully"}

@api_router.post("/internships/{internship_id}/apply")
async def apply_internship(internship_id: str, application_data: dict, user_data: dict = Depends(verify_token)):
    internship = await db.internships.find_one({"id": internship_id}, {"_id": 0})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    application = {
        "applicant_id": user_data['user_id'],
        "applicant_name": application_data.get('name'),
        "applicant_email": application_data.get('email'),
        "applicant_phone": application_data.get('phone'),
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending"
    }
    
    await db.internships.update_one(
        {"id": internship_id},
        {"$push": {"applications": application}}
    )
    
    return {"message": "Application submitted"}

# ==================== DESIGNATION ROUTES ====================

@api_router.post("/designations")
async def create_designation(designation_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create designations")
    
    designation = Designation(**designation_data)
    doc = designation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.designations.insert_one(doc)
    return {"message": "Designation created", "id": designation.id}

@api_router.get("/designations")
async def get_designations():
    designations = await db.designations.find({}, {"_id": 0}).to_list(1000)
    return designations

@api_router.delete("/designations/{designation_id}")
async def delete_designation(designation_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete designations")
    result = await db.designations.delete_one({"id": designation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Designation not found")
    return {"message": "Designation deleted successfully"}

# ==================== RECEIPT ROUTES ====================

@api_router.post("/receipts")
async def create_receipt(receipt_data: dict, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create receipts")
    
    receipt_number = generate_receipt_number()
    qr_data = f"https://nvpwelfare.in/verify-receipt/{receipt_number}"
    qr_image = generate_qr_code(qr_data)
    
    receipt = {
        "id": str(uuid.uuid4()),
        "receipt_number": receipt_number,
        "receipt_type": receipt_data.get('receipt_type'),
        "recipient_name": receipt_data.get('recipient_name'),
        "recipient_email": receipt_data.get('recipient_email'),
        "amount": receipt_data.get('amount', 0),
        "description": receipt_data.get('description'),
        "qr_data": qr_data,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": user_data['user_id']
    }
    
    await db.receipts.insert_one(receipt)
    
    # Send receipt email
    html_content = f"""
    <h2>Receipt - NVP Welfare Foundation India</h2>
    <p>Dear {receipt['recipient_name']},</p>
    <p><strong>Receipt Number:</strong> {receipt_number}</p>
    <p><strong>Type:</strong> {receipt['receipt_type']}</p>
    <p><strong>Amount:</strong> ₹{receipt['amount']}</p>
    <p><strong>Description:</strong> {receipt['description']}</p>
    <img src="{qr_image}" alt="QR Code" />
    """
    await send_email(receipt['recipient_email'], f"Receipt - {receipt_number}", html_content)
    
    return {"message": "Receipt generated", "receipt_number": receipt_number}

@api_router.get("/receipts")
async def get_receipts(user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can view receipts")
    receipts = await db.receipts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return receipts

@api_router.delete("/receipts/{receipt_id}")
async def delete_receipt(receipt_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete receipts")
    result = await db.receipts.delete_one({"id": receipt_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return {"message": "Receipt deleted successfully"}

# ==================== STATS ROUTES ====================

@api_router.get("/stats")
async def get_stats():
    total_members = await db.members.count_documents({"status": "approved"})
    total_donations = await db.donations.count_documents({"status": "completed"})
    
    # Calculate total donation amount
    donations = await db.donations.find({"status": "completed"}, {"_id": 0, "amount": 1}).to_list(10000)
    total_amount = sum(d['amount'] for d in donations)
    
    total_beneficiaries = await db.beneficiaries.count_documents({})
    total_campaigns = await db.campaigns.count_documents({"status": "active"})
    
    return {
        "total_members": total_members,
        "total_donations": total_donations,
        "total_amount": total_amount,
        "total_beneficiaries": total_beneficiaries,
        "total_campaigns": total_campaigns
    }

# ==================== RECEIPT ROUTES ====================
@api_router.patch("/users/{user_id}/approve")
async def approve_user(user_id: str, admin: dict = Depends(verify_token)):
    if admin.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Only admin allowed")
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"role": "member", "is_active": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    try:
        html = f"""
        <h2>Membership Approved</h2>
        <p>Dear {user.get('name')},</p>
        <p>Your membership has been <strong>approved</strong>. Congratulations — you can now access the member dashboard.</p>
        """
        await send_email(user['email'], "Membership Approved - NVP Welfare Foundation", html)
    except Exception as e:
        logger.warning("Failed to send approval email: %s", e)

    return {"message": "User approved and notified"}


@api_router.patch("/users/{user_id}/reject")
async def reject_user(user_id: str, admin: dict = Depends(verify_token)):
    if admin.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Only admin allowed")
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_active": False, "role": "public"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    try:
        html = f"""
        <h2>Membership Request Update</h2>
        <p>Dear {user.get('name')},</p>
        <p>We are sorry to inform you that your membership request has been <strong>rejected</strong>. For more details, please contact the admin.</p>
        """
        await send_email(user['email'], "Membership Rejected - NVP Welfare Foundation", html)
    except Exception as e:
        logger.warning("Failed to send rejection email: %s", e)

    return {"message": "User rejected and notified"}



# ==================== IMAGE UPLOAD ROUTES ====================

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image and return its URL"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    
    # Generate unique filename
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return URL (this will be served statically)
    return {"url": f"/api/uploads/{unique_filename}", "filename": unique_filename}

from fastapi.responses import FileResponse

@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded files"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# ==================== ADDITIONAL DELETE ROUTES ====================

@api_router.delete("/members/{member_id}")
async def delete_member(member_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete members")
    result = await db.members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member deleted successfully"}

@api_router.delete("/donations/{donation_id}")
async def delete_donation(donation_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete donations")
    result = await db.donations.delete_one({"id": donation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Donation not found")
    return {"message": "Donation deleted successfully"}

@api_router.delete("/certificates/{certificate_id}")
async def delete_certificate(certificate_id: str, user_data: dict = Depends(verify_token)):
    if user_data['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete certificates")
    result = await db.certificates.delete_one({"id": certificate_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"message": "Certificate deleted successfully"}

# Root route
@app.get("/")
async def root():
    return {"message": "NVP Welfare Foundation India API", "status": "running"}

# Include router
# app.include_router(api_router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


origins_env = os.environ.get('CORS_ORIGINS',
    'https://ngo-3-freelancing-project-ye1a.vercel.app,https://ngo-3-freelancing-project.onrender.com'
)
origins = [o.strip() for o in origins_env.split(',') if o.strip()]

@app.middleware("http")
async def log_preflight(request, call_next):
    if request.method == "OPTIONS":
        logger.info("OPTIONS request headers: %s", dict(request.headers))
    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
       allow_origins=[
        "http://localhost:3000",
        "http://0.0.0.0:8000",
        "https://ngo-3-freelancing-project-ye1a.vercel.app"
    ],
    allow_credentials=False,     # only if you need cookies/auth
    allow_methods=["*"],        # allow OPTIONS, POST, GET, etc.
    allow_headers=["*"],
    max_age=3600,
)

app.include_router(api_router)


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


