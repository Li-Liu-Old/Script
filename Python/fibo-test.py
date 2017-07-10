#先将模块放至C:\Program Files (x86)\Python36\Lib
import fibo

list1 = [1,2,3,'true']
list2 = list1*2

#注意extend用法
#Wrong:list3 = list1.extend(list2)
list1.extend(list2)

print(list1)

print(fibo.fib(100))