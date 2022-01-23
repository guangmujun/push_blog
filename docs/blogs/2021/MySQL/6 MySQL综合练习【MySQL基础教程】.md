---
title: MySQL学习之MySQL综合练习
date: 2020-12-28
permalink: /mysql-learning-case-practice.html
tags:
 - MySQL 
categories:
 - MySQL
---

## 练习一

**各部门工资最高的员工（难度：中等）** 创建Employee 表，包含所有员工信息，每个员工有其对应的 Id, salary 和 department
Id。


​    
    +----+-------+--------+--------------+
    | Id | Name  | Salary | DepartmentId |
    +----+-------+--------+--------------+
    | 1  | Joe   | 70000  | 1            |
    | 2  | Henry | 80000  | 2            |
    | 3  | Sam   | 60000  | 2            |
    | 4  | Max   | 90000  | 1            |
    +----+-------+--------+--------------+


创建Department 表，包含公司所有部门的信息。


​    
    +----+----------+
    | Id | Name     |
    +----+----------+
    | 1  | IT       |
    | 2  | Sales    |
    +----+----------+


编写一个 SQL 查询，找出每个部门工资最高的员工。例如，根据上述给定的表格，Max 在 IT 部门有最高工资，Henry 在 Sales 部门有最高工资。


​    
    +------------+----------+--------+
    | Department | Employee | Salary |
    +------------+----------+--------+
    | IT         | Max      | 90000  |
    | Sales      | Henry    | 80000  |
    +------------+----------+--------+


​    
​    
        // 创建Employee 表格
        private static void createTable(Statement stmt) throws SQLException{
            String sql = "create table Employee("            //"+"这个只是起到一个语句之间的连接作用
                    +" Id INT NOT NULL,"
                    +" Name VARCHAR(32) NOT NULL,"
                    +" Salary INT NOT NULL,"
                    +" DepartmentId INT NOT NULL,"
                    +" PRIMARY KEY (Id))"
                    +" comment= 'Employee Info Table';";
            int count = stmt.executeUpdate(sql);
            System.out.println(count);
        }
    
        //插入记录
        private static void insertRecord(Statement stmt) throws SQLException{
            List<String> sqlList = Arrays.asList(
                    "insert into Employee VALUES (1, 'Joe', 70000, 1)",
                    "insert into Employee VALUES (2, 'Henry', 80000, 2)",
                    "insert into Employee VALUES (3, 'Sam', 60000, 2)",
                    "insert into Employee VALUES (4, 'Max', 90000, 1)"
            );
            for (String sql : sqlList){
                int count = stmt.executeUpdate(sql);
                System.out.println(count);
            }
    
        }


​    
​    
        // 创建Department 表格
        private static void createTable(Statement stmt) throws SQLException{
            String sql = "create table Department("            //"+"这个只是起到一个语句之间的连接作用
                    +" Id INT NOT NULL,"
                    +" Name VARCHAR(32) NOT NULL,"
                    +" PRIMARY KEY (Id))"
                    +" comment= 'Department Info Table';";
            int count = stmt.executeUpdate(sql);
            System.out.println(count);
        }
    
        //插入记录
        private static void insertRecord(Statement stmt) throws SQLException{
            List<String> sqlList = Arrays.asList(
                    "insert into Department VALUES (1, 'IT')",
                    "insert into Department VALUES (2, 'Sales')"
            );
            for (String sql : sqlList){
                int count = stmt.executeUpdate(sql);
                System.out.println(count);
            }
    
        }


​    
​    
    SELECT DepartmentId, MAX(Salary) AS Salary
    FROM Employee
    GROUP BY DepartmentId


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228210114.png)


​    
    SELECT e.Name AS Department, d.Name AS Employee, d.Salary
    FROM Employee AS d
    JOIN Department AS e
    ON e.Id = d.DepartmentId


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228210358.png)


​    
    SELECT e.Name AS Department, d.Name AS Employee, d.Salary
    FROM Employee AS d
    JOIN Department AS e
    ON e.Id = d.DepartmentId
    WHERE (DepartmentId, Salary)
    IN (
    SELECT DepartmentId, MAX(Salary) AS Salary
    FROM Employee
    GROUP BY DepartmentId)


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228210227.png)

## 练习二

**换座位（难度：中等）** 小美是一所中学的信息科技老师，她有一张 seat 座位表，平时用来储存学生名字和与他们相对应的座位 id。 其中纵列的
**id** 是连续递增的 小美想改变相邻俩学生的座位。 你能不能帮她写一个 SQL query 来输出小美想要的结果呢？ 请创建如下所示seat表：
**示例：**


​    
    +---------+---------+
    |    id   | student |
    +---------+---------+
    |    1    | Abbot   |
    |    2    | Doris   |
    |    3    | Emerson |
    |    4    | Green   |
    |    5    | Jeames  |
    +---------+---------+


假如数据输入的是上表，则输出结果如下：


​    
    +---------+---------+
    |    id   | student |
    +---------+---------+
    |    1    | Doris   |
    |    2    | Abbot   |
    |    3    | Green   |
    |    4    | Emerson |
    |    5    | Jeames  |
    +---------+---------+


**注意：** 如果学生人数是奇数，则不需要改变最后一个同学的座位。


​    
    CREATE TABLE seat(
    id INTEGER NOT NULL,
    student VARCHAR(32) NOT NULL,
    PRIMARY KEY (id)
    );
    
    INSERT INTO seat VALUES (1, 'Abbot');
    INSERT INTO seat VALUES (2, 'Doris');
    INSERT INTO seat VALUES (3, 'Emerson');
    INSERT INTO seat VALUES (4, 'Green');
    INSERT INTO seat VALUES (5, 'Jeames');


​    
​    
    SELECT
    (
    CASE WHEN id %2 = 0 THEN id-1 -- id是偶数
    WHEN id %2 = 1 AND counts = id THEN id -- id是奇数且是最后一个
    ELSE id + 1 END -- id是奇数但不是最后一个
    )
    AS id, student
    FROM seat, (SELECT COUNT(1) AS counts FROM seat) c -- 个数
    ORDER BY 1;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228212330.png)

## 练习三

**分数排名（难度：中等** ） 编写一个 SQL
查询来实现分数排名。如果两个分数相同，则两个分数排名（Rank）相同。请注意，平分后的下一个名次应该是下一个连续的整数值。换句话说，名次之间不应该有“间隔”。
创建以下score表：


​    
    +----+-------+
    | Id | Score |
    +----+-------+
    | 1  | 3.50  |
    | 2  | 3.65  |
    | 3  | 4.00  |
    | 4  | 3.85  |
    | 5  | 4.00  |
    | 6  | 3.65  |
    +----+-------+


例如，根据上述给定的 Scores 表，你的查询应该返回（按分数从高到低排列）：


​    
    +-------+------+
    | Score | Rank |
    +-------+------+
    | 4.00  | 1    |
    | 4.00  | 1    |
    | 3.85  | 2    |
    | 3.65  | 3    |
    | 3.65  | 3    |
    | 3.50  | 4    |
    +-------+------+


​    
​    
    CREATE TABLE score(
    Id INTEGER NOT NULL,
    Score FLOAT NOT NULL,
    PRIMARY KEY (id)
    );
    
    INSERT INTO score VALUES (1, 3.50);
    INSERT INTO score VALUES (2, 3.65);
    INSERT INTO score VALUES (3, 4.00);
    INSERT INTO score VALUES (4, 3.85);
    INSERT INTO score VALUES (5, 4.00);
    INSERT INTO score VALUES (6, 3.65);


​    
​    
    SELECT Score,
    DENSE_RANK() over (ORDER BY Score DESC) AS 'Rank'
    FROM score;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228213200.png)

## 练习四

**连续出现的数字（难度：中等）** 编写一个 SQL 查询，查找所有至少连续出现三次的数字。


​    
    +----+-----+
    | Id | Num |
    +----+-----+
    | 1  |  1  |
    | 2  |  1  |
    | 3  |  1  |
    | 4  |  2  |
    | 5  |  1  |
    | 6  |  2  |
    | 7  |  2  |
    +----+-----+


例如，给定上面的 Logs 表， 1 是唯一连续出现至少三次的数字。


​    
    +-----------------+
    | ConsecutiveNums |
    +-----------------+
    | 1               |
    +-----------------+


​    
​    
    CREATE TABLE numbers(
    Id INTEGER NOT NULL,
    Num INTEGER NOT NULL,
    PRIMARY KEY (Id)
    );
    
    INSERT INTO numbers VALUES (1, 1);
    INSERT INTO numbers VALUES (2, 1);
    INSERT INTO numbers VALUES (3, 1);
    INSERT INTO numbers VALUES (4, 2);
    INSERT INTO numbers VALUES (5, 1);
    INSERT INTO numbers VALUES (6, 2);
    INSERT INTO numbers VALUES (7, 2);


​    
​    
    SELECT a.Num AS ConsecutiveNums
    FROM numbers a, numbers b, numbers c
    WHERE a.Id = b.Id-1 AND b.Id = c.Id-1 AND a.Num = b.Num AND b.Num = c.Num;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228213842.png)

## 练习五

**树节点 （难度：中等）** 对于 **tree** 表， _id_ 是树节点的标识， _p_id_ 是其父节点的 _id_ 。


​    
    +----+------+
    | id | p_id |
    +----+------+
    | 1  | null |
    | 2  | 1    |
    | 3  | 1    |
    | 4  | 2    |
    | 5  | 2    |
    +----+------+


每个节点都是以下三种类型中的一种：

  * Root: 如果节点是根节点。
  * Leaf: 如果节点是叶子节点。
  * Inner: 如果节点既不是根节点也不是叶子节点。

写一条查询语句打印节点id及对应的节点类型。按照节点id排序。上面例子的对应结果为：


​    
    +----+------+
    | id | Type |
    +----+------+
    | 1  | Root |
    | 2  | Inner|
    | 3  | Leaf |
    | 4  | Leaf |
    | 5  | Leaf |
    +----+------+


**说明**

  * 节点’1’是根节点，因为它的父节点为NULL，有’2’和’3’两个子节点。
  * 节点’2’是内部节点，因为它的父节点是’1’，有子节点’4’和’5’。
  * 节点’3’，‘4’，'5’是叶子节点，因为它们有父节点但没有子节点。

下面是树的图形：


​    
        1         
      /   \ 
     2    3    
    / \
    4  5


**注意** 如果一个树只有一个节点，只需要输出根节点属性。


​    
    CREATE TABLE tree(
    id INTEGER NOT NULL,
    p_id INTEGER,
    PRIMARY KEY (id)
    );
    
    INSERT INTO tree VALUES (1, null);
    INSERT INTO tree VALUES (2, 1);
    INSERT INTO tree VALUES (3, 1);
    INSERT INTO tree VALUES (4, 2);
    INSERT INTO tree VALUES (5, 2);


​    
​    
    SELECT id, 
    (
        CASE WHEN p_id IS NULL THEN 'Root'
              WHEN id > pids THEN 'Leaf'
              ELSE 'Inner' END
    ) AS TYPE
    FROM tree,
    (
        SELECT MAX(p_id) AS pids FROM tree
    ) a;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228214436.png)

## 练习六

**至少有五名直接下属的经理 （难度：中等）** **Employee**
表包含所有员工及其上级的信息。每位员工都有一个Id，并且还有一个对应主管的Id（ManagerId）。


​    
    +------+----------+-----------+----------+
    |Id    |Name      |Department |ManagerId |
    +------+----------+-----------+----------+
    |101   |John      |A          |null      |
    |102   |Dan       |A          |101       |
    |103   |James     |A          |101       |
    |104   |Amy       |A          |101       |
    |105   |Anne      |A          |101       |
    |106   |Ron       |B          |101       |
    +------+----------+-----------+----------+


针对 **Employee** 表，写一条SQL语句找出有5个下属的主管。对于上面的表，结果应输出：


​    
    +-------+
    | Name  |
    +-------+
    | John  |
    +-------+


**注意:** 没有人向自己汇报。


​    
    create table Employees(
        Id INTEGER  primary key ,
        Name VARCHAR(20),
        Department VARCHAR(5),
        ManagerId  INTEGER
    );
    insert into Employees value(101,'John','A',NULL);
    insert into Employees value(102,'Dan','A',101);
    insert into Employees value(103,'James','A',101);
    insert into Employees value(104,'Amy','A',101);
    insert into Employees value(105,'Anne','A',101);
    insert into Employees value(106,'Ron','B',101);


​    
​    
    SELECT ManagerId AS counts
        FROM Employees
        WHERE ManagerId IS NOT NULL 
        GROUP BY ManagerId 
        HAVING COUNT(*) >= 5 ;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228214903.png)


​    
    SELECT Name FROM Employees
    WHERE Id IN 
    (
        SELECT ManagerId AS counts
        FROM Employees
        WHERE ManagerId IS NOT NULL 
        GROUP BY ManagerId 
        HAVING COUNT(*) >= 5 
    );


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228215023.png)

## 练习七

**分数排名 （难度：中等）** 创建以下score表：


​    
    +----+-------+
    | Id | Score |
    +----+-------+
    | 1  | 3.50  |
    | 2  | 3.65  |
    | 3  | 4.00  |
    | 4  | 3.85  |
    | 5  | 4.00  |
    | 6  | 3.65  |
    +----+-------+


练习三的分数表，实现排名功能，但是排名需要是非连续的，如下：


​    
    +-------+------+
    | Score | Rank |
    +-------+------+
    | 4.00  | 1    |
    | 4.00  | 1    |
    | 3.85  | 3    |
    | 3.65  | 4    |
    | 3.65  | 4    |
    | 3.50  | 6    |
    +-------+------


​    
​    
    SELECT Score, RANK() over (ORDER BY Score DESC) AS ranking
    FROM score;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228215216.png)

## 练习八

**查询回答率最高的问题 （难度：中等）** 求出 **survey_log** 表中回答率最高的问题，表格的字段有： **uid, action,
question_id, answer_id, q_num, timestamp** 。 uid是用户id；action的值为：“show”，
“answer”，
“skip”；当action是"answer"时，answer_id不为空，相反，当action是"show"和"skip"时为空（null）；q_num是问题的数字序号。
写一条sql语句找出回答率最高的问题。 **举例：** **输入** uid | action | question_id | answer_id |
q_num | timestamp  
---|---|---|---|---|---  
5 | show | 285 | null | 1 | 123  
5 | answer | 285 | 124124 | 1 | 124  
5 | show | 369 | null | 2 | 125  
5 | skip | 369 | null | 2 | 126  
**输出** survey_log  
---  
285  
**说明** 问题285的回答率为1/1，然而问题369的回答率是0/1，所以输出是285。 **注意：**
最高回答率的意思是：同一个问题出现的次数中回答的比例。


​    
    create table survey_log(
        uid INTEGER,
        action  VARCHAR(10),
        question_id  INTEGER,
        answer_id INTEGER,
        q_num  INTEGER, 
        timestamp  INTEGER
    );
    INSERT INTO survey_log value(5,"show",285,null,1,123);
    INSERT INTO survey_log  value(5,"answer",285,124124,1,124);
    INSERT INTO survey_log  value(5,"show",369,null,2,125);
    INSERT INTO survey_log  value(5,"show",369,null,2,126);


​    
​    
    SELECT question_id, COUNT(answer_id) AS counts
        FROM survey_log GROUP BY question_id
        ORDER BY counts DESC;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228215625.png)


​    
    SELECT a.question_id
    FROM 
    (
        SELECT question_id, COUNT(answer_id) AS counts
        FROM survey_log GROUP BY question_id
        ORDER BY counts DESC
    ) a
    LIMIT 1;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228215715.png)

## 练习九

**各部门前3高工资的员工（难度：中等）** 将项目7中的employee表清空，重新插入以下数据（其实是多插入5,6两行）：


​    
    +----+-------+--------+--------------+
    | Id | Name  | Salary | DepartmentId |
    +----+-------+--------+--------------+
    | 1  | Joe   | 70000  | 1            |
    | 2  | Henry | 80000  | 2            |
    | 3  | Sam   | 60000  | 2            |
    | 4  | Max   | 90000  | 1            |
    | 5  | Janet | 69000  | 1            |
    | 6  | Randy | 85000  | 1            |
    +----+-------+--------+--------------+


编写一个 SQL 查询，找出每个部门工资前三高的员工。例如，根据上述给定的表格，查询结果应返回：


​    
    +------------+----------+--------+
    | Department | Employee | Salary |
    +------------+----------+--------+
    | IT         | Max      | 90000  |
    | IT         | Randy    | 85000  |
    | IT         | Joe      | 70000  |
    | Sales      | Henry    | 80000  |
    | Sales      | Sam      | 60000  |
    +------------+----------+--------+


此外，请考虑实现各部门前N高工资的员工功能。


​    
    create table Employee2
    (
        Id INTEGER PRIMARY KEY auto_increment,
        Name VARCHAR(10),
        Salary  INTEGER ,
        SepartmentId INTEGER
    );
    INSERT INTO Employee2 value(0,"Joe",70000,1);
    INSERT INTO Employee2 value(0,"Henry",80000,2);
    INSERT INTO Employee2 value(0,"Sam",60000,2);
    INSERT INTO Employee2 value(0,"Max",90000,1);
    INSERT INTO Employee2 value(0,"Janet",69000,1);
    INSERT INTO Employee2 value(0,"Randy",85000,1);


​    
​    
​    
    SELECT Department,Employee,Salary
    FROM(
    SELECT department.Name 'Department',Employee.name 'Employee',Salary,ROW_NUMBER() OVER(PARTITION BY department.Id ORDER BY Salary DESC) 'ranking'
    FROM employee INNER JOIN department
    ON employee.departmentid = department.Id) t1
    WHERE ranking <= 3;


## 练习十

**平面上最近距离 (难度: 困难）** **point_2d** 表包含一个平面内一些点（超过两个）的坐标值（x，y）。
写一条查询语句求出这些点中的最短距离并保留2位小数。


​    
    |x   | y  |
    |----|----|
    | -1 | -1 |
    |  0 |  0 |
    | -1 | -2 |


最短距离是1，从点（-1，-1）到点（-1，-2）。所以输出结果为： | shortest | 1.00


​    
    +--------+
    |shortest|
    +--------+
    |1.00    |
    +--------+


**注意：** 所有点的最大距离小于10000。


​    
    create table point_2d (
        x INTEGER ,
        Y INTEGER
    );
    INSERT INTO point_2d value(-1,-1);
    INSERT INTO point_2d value(0,0);
    INSERT INTO point_2d value(-1,-2);


​    
​    
    SELECT MIN(POW(p1.x - p2.x, 2) + POW(p1.y - p2.y, 2)) shortest
    FROM point_2d p1 CROSS JOIN point_2d p2
    ON (p1.x <> p2.x OR p1.y <> p2.y);


## 练习十一

**行程和用户（难度：困难）** Trips 表中存所有出租车的行程信息。每段行程有唯一键 Id，Client_Id 和 Driver_Id 是 Users
表中 Users_Id 的外键。Status 是枚举类型，枚举成员为 (‘completed’, ‘cancelled_by_driver’,
‘cancelled_by_client’)。  Id | Client_Id | Driver_Id | City_Id | Status |
Request_at  
---|---|---|---|---|---  
1 | 1 | 10 | 1 | completed | 2013-10-1  
2 | 2 | 11 | 1 | cancelled_by_driver | 2013-10-1  
3 | 3 | 12 | 6 | completed | 2013-10-1  
4 | 4 | 13 | 6 | cancelled_by_client | 2013-10-1  
5 | 1 | 10 | 1 | completed | 2013-10-2  
6 | 2 | 11 | 6 | completed | 2013-10-2  
7 | 3 | 12 | 6 | completed | 2013-10-2  
8 | 2 | 12 | 12 | completed | 2013-10-3  
9 | 3 | 10 | 12 | completed | 2013-10-3  
10 | 4 | 13 | 12 | cancelled_by_driver | 2013-10-3  
Users 表存所有用户。每个用户有唯一键 Users_Id。Banned 表示这个用户是否被禁止，Role 则是一个表示（‘client’,
‘driver’, ‘partner’）的枚举类型。


​    
    +----------+--------+--------+
    | Users_Id | Banned |  Role  |
    +----------+--------+--------+
    |    1     |   No   | client |
    |    2     |   Yes  | client |
    |    3     |   No   | client |
    |    4     |   No   | client |
    |    10    |   No   | driver |
    |    11    |   No   | driver |
    |    12    |   No   | driver |
    |    13    |   No   | driver |
    +----------+--------+--------+


写一段 SQL 语句查出 **2013年10月1日** 至 **2013年10月3日** 期间非禁止用户的取消率。基于上表，你的 SQL
语句应返回如下结果，取消率（Cancellation Rate）保留两位小数。


​    
    +------------+-------------------+
    |     Day    | Cancellation Rate |
    +------------+-------------------+
    | 2013-10-01 |       0.33        |
    | 2013-10-02 |       0.00        |
    | 2013-10-03 |       0.50        |
    +------------+-------------------+


​    
​    
    create table Trips(
        Id INTEGER PRIMARY KEY auto_increment,
        Client_Id INTEGER ,
        Driver_Id INTEGER,
        City_Id INTEGER,
        Status VARCHAR(50),
        Request_at DATE
    );
    INSERT INTO Trips value(0,1,10,1,"completed","2013-10-1");
    INSERT INTO Trips value(0,2,11,1,"cancelled_by_driver","2013-10-1");
    INSERT INTO Trips value(0,3,12,1,"completed","2013-10-1");
    INSERT INTO Trips value(0,4,13,1,"cancelled_by_client","2013-10-1");
    INSERT INTO Trips value(0,1,10,1,"completed","2013-10-2");
    INSERT INTO Trips value(0,2,11,1,"completed","2013-10-2");
    INSERT INTO Trips value(0,3,12,1,"completed","2013-10-2");
    INSERT INTO Trips value(0,2,12,1,"completed","2013-10-3");
    INSERT INTO Trips value(0,3,10,1,"completed","2013-10-3");
    INSERT INTO Trips value(0,4,13,1,"cancelled_by_driver","2013-10-3");


​    
​    
    CREATE TABLE Users(
        Users_Id INTEGER ,
        Banned VARCHAR(5),
        Role VARCHAR(10)
    );
    INSERT INTO Users value(1,"No","client");
    INSERT INTO Users value(2,"Yes","client");
    INSERT INTO Users value(3,"No","client");
    INSERT INTO Users value(4,"No","client");
    INSERT INTO Users value(10,"No","driver");
    INSERT INTO Users value(11,"No","driver");
    INSERT INTO Users value(12,"No","driver");
    INSERT INTO Users value(13,"No","driver");


​    
​    
​    
    SELECT Request_at, SUM(CASE WHEN Status LIKE 'cancelled%' THEN 1 ELSE 0 END) / COUNT(*) ratio
    FROM Trips INNER JOIN Users
    ON Trips.Client_Id = Users.Users_Id
    WHERE Banned <> 'Yes'
    GROUP BY Request_at;


​    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201228221002.png)

