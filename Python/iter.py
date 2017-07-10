list = [1,2,3,4]

#创建迭代器
it = iter(list)
#输出迭代器的下一个对象
print(next(it))
print(next(it))
print(next(it))

#or
import sys
while 1:
	try:
		print(next(it))
	except StopIteration:
		sys.exit()