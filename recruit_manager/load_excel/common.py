
def validate_date(date_str):
    if date_str.find(u'至今') >= 0:
        return None
    if date_str == '':
        return "1970-01-01"
    fields = date_str.split("-")
    if len(fields) == 3:
        return date_str
    elif len(fields) == 2:
        return fields[0] + "-" + fields[1] + "-01"
    elif len(fields) == 1:
        return "1970-01-01"
        return fields[0] + "-" + "01-01"

def get_year_from_date(date_str):
    fields = date_str.split("-")
    if len(fields) == 3:
        return int(fields[0])
    return 1970

def validate_degree(degree):
    degreeNO=0
    if degree.find('小学') >=0:
        degreeNO = 1
    elif degree.find('初中') >= 0:
        degreeNO = 2
    elif degree.find('高中') >= 0:
        degreeNO = 3
    elif degree.find('中专') >= 0:
        degreeNO = 4
    elif degree.find('大专') >= 0:
        degreeNO = 5
    elif degree.find('本科') >= 0:
        degreeNO = 6
    elif degree.find('硕士') >= 0:
        degreeNO = 7
    elif degree.find('博士') >= 0:
        degreeNO = 8
    elif degree.find('博士后') >= 0:
        degreeNO = 9
    return degreeNO

def validate_edu_type(edu_type):
    if edu_type.find('非统招') >= 0:
        return '非统招'
    elif edu_type.find('统招') >= 0:
        return '统招'
    elif edu_type.find('普招') >= 0:
        return '普招'
    elif edu_type.find('成招') >= 0:
        return '成招'
    else:
        return '其他'

def validate_salary(salary):
    if salary == "":
        return 0
    newSalary=''.join(list(filter(str.isdigit, salary)))
    if newSalary == "":
        return 0
    return int(newSalary)
