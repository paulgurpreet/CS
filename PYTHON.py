#PRACTICAL-1

a,b,c= eval(input("enter values( of a,b,constant) separated by commas : "))

d = b * 2 - 4 * a *c
r1 = (-b + (d) * 0.5) / 2 * a
r2 = (-b - (d) ** 0.5) / 2 * a
if d >=0:
    print("roots are real " ,r1 ,r2)
else:
    print("roots are not real")

#PRACTICAL-2
(a)
n = eval(input("enter value :"))
if n>1:
  for i in range(2,n):
      if n % i == 0:
        print(n,"is not a prime number ")
        break
  else:
          print(n,"is a prime number")
          
else:
        print(n,"is not a prime number ")

(b)
n = eval(input("enter value "))
for num in range(1,n):
    if num > 1:
        for i in range (2,num):
           if num % i ==  0:
            break
        else:
            print(num,end =',')
(c)
n = eval(input("enter value "))
count = 0
number = 2
while count < n:
    for i in range(2,number):
        if number % i == 0:
         number += 1
         break
    else:
        print(number,end=',')
        count += 1
        number += 1

#PRACTICAL-3

n = int(input("enter the no of rows :"))
for i in range(n):
 for j in range(n-i-1):
     print(" ",end = " ")
 for j in range(2*i+1):
     print("*",end =" ")
 print()
for i in range (n):
 for j in range (i+1):
     print(" ",end = " ")
 for j in range(2*n-2*i-3):
     print("*",end =" ")
print()

#PRACTICAL-4

character = input("enter data ")
if character >='A' and character<='Z':
 print("uppercase letter")
elif character >='a' and character<='z':
 print("lowercase letter")
elif character >='0' and character<='9':
 print("numeric digit")
 n = int(character)
 dict ={0:'zero',1:'first',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine'}
 print(dict[n])
else:
 print("special character")

#PRACTICAL-5

(a)
string = "hello welcome to python"
character = input("enter a character :")
f = 0
for i in string:
 if i == character:
  f += 1
print("frequency of",character,'is',f)

(b)
string = "hello welcome to python"
print(string.replace("h","t"))

(c)
string = "hello welcome to python"
print(string[1:len(string)])

(d)

string = "hello welcome to python"
print(string[:0])

#PRACTICAL-6
str1 = input("enter first string: ")
str2 = input("enter second string: ")
n1 = int(input("enter no of character which is to be swap: "))
n = str1[ :n1]
m = str2[ :n1]
if n1 <= min(len(str1),len(str2)):
 print(str1.replace(n,m))
else:
 print(str2.replace(m,n))

#PRACTICAL-7

def occurances(a,b):
 newlist =[]
 if b not in a:
     print(-1)
 else:
     i= 0
     while i< len(a):
        c=a.find(b,i)
        if c== -1:
            break
        i= c+ len(b)
        newlist.append(c)
     print(newlist)
a= input("enter first string ;")
b= input("enter second string ;")
occurances(a,b)

# PRACTICAL-8

          
