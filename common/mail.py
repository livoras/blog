# coding=utf-8

import smtplib
from email.mime.text import MIMEText
from email.header import Header

import config

def send(content=None):
  content = content or u'''
  <h1>Livoras！</h1>
  <h2>有个傻逼给评论了你！</h2>
  </a>Check it out: <a href="http://www.baidu.com" target="_blank">dianwo</a>
  '''
  msg = MIMEText(content.encode('utf-8'), 'html', 'utf-8')

  SENDER = config.SENDER
  RECIEVER = config.RECIEVER
  SMTP_SERVER = config.SMTP_SERVER
  SENDER_PASSWORD = config.SENDER_PASSWORD

  msg['Subject'] = Header(u'有个傻逼给评论了你！', 'utf-8')
  msg['From'] = SENDER
  msg['To'] = RECIEVER

  s = smtplib.SMTP_SSL(SMTP_SERVER, 465)
  s.login(SENDER, SENDER_PASSWORD)
  s.sendmail(SENDER, RECIEVER, msg.as_string())
  s.quit()
  