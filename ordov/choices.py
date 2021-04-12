# Choices used for M2M tables are actually not used in
# varChar fields. They must be manually inserted into db.

import pytz
from django_countries import countries

TIMEZONE_CHOICES = tuple((choice, choice) for choice in pytz.common_timezones)

COUNTRY_CHOICES = tuple(countries)

GENDER_CHOICES = (
    ('不限', '不限'),
    ('男', '男'),
    ('女', '女'),
)
MARRIAGE_CHOICES = (
	('', ''),
	('未婚', '未婚'),
	('已婚', '已婚'),
	('离婚', '离婚'),
)

BIRTH_MONTH_CHOICES = (
	('',''),
	('1', '1'),
	('2', '2'),
	('3', '3'),
	('4', '4'),
	('5', '5'),
	('6', '6'),
	('7', '7'),
	('8', '8'),
	('9', '9'),
	('10', '10'),
	('11', '11'),
	('12', '12'),
)

USER_TYPE_CHOICES = (
    ('', ''),
    ('Candidate', 'Candidate'),
    ('Recruiter','Recruiter'),
    ('Employer','Employer'),
    ('Manager','Manager'),
)

DEGREE_CHOICES = (
    (0 , ''),
    (1, '小学'),
    (2, '初中'),
    (3, '高中'),
    (4, '中专'),
    (5, '大专'),
    (6, '本科'),
    (7, '硕士'),
    (8, '博士'),
    (9, '博士后'),
)

DEGREE_CHOICES_MAP = {
    "小学": 1,
    "初中": 2,
    "高中": 3,
    "中专": 4,
    "大专": 5,
    "本科": 6,
    "硕士": 7,
    "博士": 8,
    "博士后": 9,
}

BIRTH_YEAR_CHOICES = ( 
	('',''),
    ('1980','1980'),
    ('1981','1981'),
    ('1982','1982'),
    ('1983','1983'),
    ('1984','1984'),
    ('1985','1985'),
    ('1986','1986'),
    ('1987','1987'),
    ('1988','1988'),
    ('1989','1989'),
    ('1990','1990'),
    ('1991','1991'),
    ('1992','1992'),
    ('1993','1993'),
    ('1994','1994'),
    ('1995','1995'),
    ('1996','1996'),
    ('1997','1997'),
    ('1998','1998'),
    ('1999','1999'),
    ('2000','2000'),
    ('2001','2001'),
    ('2002','2002'),
    ('2003','2003'),
    ('2004','2004'),
    ('2005','2005'),
    ('2006','2006'),
    ('2007','2007'),
    ('2008','2008'),
)

GENDER_CHOICES = (
				('',''),
				('male','Male'),
				('female', 'Female'),
			)

EDUCATION_CHOICES = (
				('',''),
				('High School','High School'),
				('Vocational School', 'Vocational School'),
				('Community College','Community College'),
				("Bachelor's Degree", "Bachelor's Degree"),
				("Master's Degree", "Master's Degree"),
				('MBA', 'MBA'),
				('PhD', 'PhD'),						
			)

EMPLOYER_TYPE_CHOICES = (
			('University', 'University'), 
			('High School', 'High School'),
			('Middle School', 'Middle School'), 
			('Primary School', 'Primary School'),
			('Kindergarten', 'Kindergarten'),
			('Youth Language Center', 'Youth Language Center'),
			('Adult Language Center', 'Adult Language Center'),			
		)

MAJOR_CHOICES = ( 
    ('',''),
    ('计算机', '计算机'),
    ('金融', '金融'),
    ('微电子', '微电子'),
    ('数学', '数学'),
    ('英语', '英语'),
    ('网站设计与制作', '网站设计与制作'),
    ('幼儿教育', '幼儿教育'),
    ('大数据', '大数据'),
    ('经济管理', '经济管理'),
    ('幼儿教育', '幼儿教育'),
)

POSITION_TYPE_CHOICES = (
			('Teacher', 'Teacher'),
			('Manager', 'Manager'),
			('Principal', 'Principal'),
			('Partner', 'Partner'), 									
		)

DESIRED_MONTHLY_SALARY_CHOICES = (
			('1000', '1000+'), 
			('2000', '2000+'), 
			('3000', '3000+'),
			('4000', '4000+'), 
			('5000', '5000+'),
			('6000', '6000+'), 
			('7000', '7000+'),
			('8000', '8000+'), 
			('9000', '9000+'),
			('10000', '10000+'),
			('11000', '11000+'), 
			('12000', '12000+'),
			('13000', '13000+'),
			('14000', '14000+'),
			('15000', '15000+'), 
			('16000', '16000+'),
			('17000', '17000+'),
			('18000', '18000+'),
			('19000', '19000+'),
			('20000', '20000+'),
			('21000', '21000+'),
			('22000', '22000+'),
			('23000', '23000+'),
			('24000', '24000+'),
			('25000', '25000+'),								 
		)

HUNTING_STATUS_CHOICES = (
        (-1, ""),
        (1, '在职,不找工作'),
        (2, '在职,考虑新机会'),
        (3, '离职,正在找工作'),
        (4, '其他'),
)


HUNTING_STATUS_CHOICES_MAP = {
    "在职,不找工作": 0,
    "在职,考虑新机会": 1,
    "离职,正在找工作": 3,
}

