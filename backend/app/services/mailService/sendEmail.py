from pathlib import Path

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr

from app.config.email import email_settings

mail_conf = ConnectionConfig(
  MAIL_USERNAME=email_settings.MAIL_USERNAME,
  MAIL_PASSWORD=email_settings.MAIL_PASSWORD,
  MAIL_FROM=email_settings.MAIL_FROM,
  MAIL_PORT=email_settings.MAIL_PORT,
  MAIL_SERVER=email_settings.MAIL_SERVER,
  MAIL_FROM_NAME=email_settings.MAIL_FROM_NAME,
  MAIL_STARTTLS=email_settings.MAIL_STARTTLS,
  MAIL_SSL_TLS=email_settings.MAIL_SSL_TLS,
  USE_CREDENTIALS=email_settings.USE_CREDENTIALS,
  VALIDATE_CERTS=email_settings.VALIDATE_CERTS,
  TEMPLATE_FOLDER=Path(__file__).resolve().parent.parent.parent / "templates",
)

mail = FastMail(mail_conf)


async def send_email_verification_link(
  background_tasks: BackgroundTasks, email: EmailStr, verification_link: str
):
  message = MessageSchema(
    subject="Email Verification",
    recipients=[email],
    template_body={"verification_link": verification_link},
    subtype=MessageType.html,
  )

  background_tasks.add_task(
    mail.send_message, message, template_name="emailVerification.html"
  )


async def send_password_reset_link(
  background_tasks: BackgroundTasks, email: EmailStr, password_reset_link: str
):
  message = MessageSchema(
    subject="Password Reset",
    recipients=[email],
    template_body={"password_reset_link": password_reset_link},
    subtype=MessageType.html,
  )

  background_tasks.add_task(
    mail.send_message, message, template_name="passwordReset.html"
  )
