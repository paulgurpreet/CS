USE StudentSocietyDB;
DROP TABLE IF EXISTS ENROLLMENT;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS SOCIETY;
CREATE TABLE STUDENT (
	RollNo CHAR(6) PRIMARY KEY,
	StudentName VARCHAR(20),
	Course VARCHAR(10),
	DOB DATE
);
create table society (
	SocID char(6) primary key,
    SocName varchar(20),
    MentorName varchar(15),
    TotalSeats int
);
create table ENROLLMENT (
	RollNo char(6),
    SID char(6),
    DateOfEnrollment DATE,
    foreign key (RollNo)
    references student(RollNo),
    foreign key(sid)
    references society(SocID)
);
INSERT INTO STUDENT VALUES
('R001', 'Aman', 'CS', '2001-05-10'),
('R002', 'Rahul', 'Chem', '2000-03-15'),
('R003', 'Anita', 'CS', '2002-07-20'),
('R004', 'Zoya', 'Math', '2001-01-12'),
('R005', 'Arjun', 'Chem', '2001-09-05'),
('R006', 'Akash', 'CS', '2000-11-18'),
('R007', 'Riya', 'Chem', '2001-02-25');

INSERT INTO SOCIETY VALUES
('S001', 'NSS', 'Gupta', 50),
('S002', 'Debating', 'Sharma', 40),
('S003', 'Dancing', 'Gupta', 30),
('S004', 'Shashakt', 'Verma', 35),
('S005', 'Sports', 'Singh', 45);

INSERT INTO ENROLLMENT VALUES
('R001', 'S001', '2018-01-15'),
('R002', 'S002', '2018-01-20'),
('R003', 'S001', '2018-02-10'),
('R001', 'S003', '2018-02-15'),
('R005', 'S004', '2018-03-01'),
('R006', 'S005', '2018-03-10'),
('R007', 'S002', '2018-03-15'),
('R003', 'S003', '2018-03-20');


USE StudentSocietyDB;

SELECT*FROM STUDENT;
SELECT*FROM SOCIETY;
SELECT*FROM ENROLLMENT;

-- 1
select distinct studentname
from student s
join enrollment e
on s.rollno = e.rollno;

-- 2
select socname
from society;

-- 3
select StudentName
from STUDENT
where StudentName like 'a%';

-- 4
select *
from student
where course in ('cs','chem');

-- 5
select StudentName
from student
where (RollNo like 'x%' or RollNo like 'z%')
and RollNo like '%9';

-- 6
select *
from society
where TotalSeats > 30;

-- 7 
update society
set MentorName='singh' 
where SocName='nss';

-- 8
select sid
from enrollment
group by sid
having count(rollno) > 5;

-- 9 
SELECT s.StudentName
FROM student s
JOIN enrollment e
ON s.RollNo = e.RollNo
JOIN society so
ON e.SID = so.SocID
WHERE so.SocName = 'nss'
ORDER BY s.DOB DESC
limit 1;

-- 10
select so.socname
from society so
join enrollment e
on so.socid = e.sid
group by so.socname
order by count(*) desc
limit 1;

-- 11
select so.socname
from society so
join enrollment e
on so.socid = e.sid
group by so.socname
order by count(*) asc
limit 2;

-- 12
select studentname
from student
where rollno not in
(
	select rollno
    from enrollment
);

-- 13
select rollno
from enrollment
group by rollno
having count(sid)>=2;

-- 14
select  sid
from enrollment
group by sid
order by count(*) desc
limit 1;

-- 15
select s.studentname, so.socname
from student s
join enrollment e
on s.rollno = e.rollno
join society so
on e.sid = so.socid;

-- 16
select distinct s.studentname
from student s
join enrollment e
on s.rollno = e.rollno
join society so
on e.sid = so.socid
where so.socname in ('debating','dancing', 'shashakt');

-- 17
select socname
from society
where mentorname like '%gupta%';

-- 18
select so.socname
from society so
join enrollment e
on so.socid = e.sid
group by so.socname, so.totalseats
having count(e.rollno) = 0.1*so.totalseats;

-- 19
select so.socname, so.totalseats - count(e.rollno) as vacantseats
from society so
left join enrollment e
on so.socid = e.sid
group by so.socname, so.totalseats;

-- 20
update society
set totalseats = totalseats + (totalseats*0.1);
select *from society;

-- 21
alter table enrollment
add FeesPaid varchar(3);

-- 22
update enrollment
set dateofenrollment = '2018-01-15'
where sid = 's001';

update enrollment
set dateofenrollment = current_date()
where sid = 's002';

update enrollment
set dateofenrollment = '2018-01-02'
where sid = 's003';

-- 23
create view societystudentcount as
select so.socname,
count(e.rollno) as totalstudents
from society so
left join enrollment e
on so.socid = e.sid
group by so.socname;
select*from societystudentcount;

-- 24
select studentname from student s
where not exists
(
select socid
from society
where socid not in
(
select sid
from enrollment
where rollno = s.rollno
)
);

-- 25
select count(*) as societieswithmorethan5students
from
(select sid
from enrollment
group by sid
having count(rollno) > 5) as T;

-- 26
alter table student
add MobileNo varchar(10)
default '9999999999';

-- 27
select count(*) as studentage20plus
from student where TIMESTAMPDIFF(year,dob,current_date())>=20;

-- 28
select distinct s.studentname
from student s 
join ENROLLMENT E
on s.rollno = e.rollno
where year(s.dob) = 2001;

-- 29
select count(*) as scoietycount
from society so
join enrollment e
on so.socid = e.sid
where so.socname like 's%t'
group by so.socid
having count(e.rollno)>=5;

-- 30
select so.socname, so.mentorname,
so.totalseats as totalcapacity,
count(e.rollno) as totalenrolled,
so.totalseats - count(e.rollno) as unfilledseats
from society so
left join enrollment e
on so.socid = e.sid
group by 
so.socname,
so.mentorname,
so.totalseats;

-- II
/*
CREATE USER 'studentuser'@'localhost'
IDENTIFIED BY 'Student@123';

GRANT ALL PRIVILEGES
ON StudentSocietyDB.*
TO 'studentuser'@'localhost';

FLUSH PRIVILEGES;
SELECT user, host
FROM mysql.user;

create role studentrole;
grant select, insert, update
on student
to studentrole;

grant select, insert, update
on society
to studentrole;

grant select, insert, update
on enrollment
to studentrole;
GRANT studentrole
TO 'studentuser'@'localhost';

SET DEFAULT ROLE studentrole
TO 'studentuser'@'localhost';
SELECT * FROM mysql.role_edges;

GRANT SELECT, INSERT, UPDATE
ON StudentSocietyDB.student
TO studentrole;

GRANT studentrole
TO 'studentuser'@'localhost';

SET DEFAULT ROLE studentrole
TO 'studentuser'@'localhost';
SHOW GRANTS FOR 'studentuser'@'localhost';

revoke update
on student
from studentrole;
SHOW GRANTS FOR studentrole;

create index idx_rollno
on student(rollno);
SELECT user
FROM mysql.user
WHERE account_locked = 'y';

SELECT GRANTEE,
       TABLE_NAME,
       PRIVILEGE_TYPE
FROM information_schema.table_privileges
WHERE GRANTEE LIKE "'studentrole'%";

SELECT INDEX_NAME, TABLE_NAME
FROM information_schema.statistics
WHERE TABLE_SCHEMA = 'StudentSocietyDB'
AND INDEX_NAME = 'idx_rollno';

select*from student;
select*from society;
select*from enrollment;
*/
-- II correct ig
-- 1. Create User
CREATE USER 'studentuser'@'localhost'
IDENTIFIED BY 'Student@123';
-- 2. Create Role
CREATE ROLE studentrole;
-- 3. Grant Privileges to a Role
GRANT SELECT, INSERT, UPDATE
ON StudentSocietyDB.student
TO studentrole;

GRANT SELECT, INSERT, UPDATE
ON StudentSocietyDB.society
TO studentrole;

GRANT SELECT, INSERT, UPDATE
ON StudentSocietyDB.enrollment
TO studentrole;
-- 4. Assign Role to User
GRANT studentrole
TO 'studentuser'@'localhost';
-- 5.Revoke Privileges from Role
REVOKE UPDATE
ON StudentSocietyDB.student
FROM studentrole;
-- 6. Create Index
CREATE INDEX idx_rollno
ON student(RollNo);

-- Check User Grants
SHOW GRANTS FOR 'studentuser'@'localhost';
-- Check Role Grants
SHOW GRANTS FOR studentrole;
-- View Indexes
SHOW INDEX FROM student;






