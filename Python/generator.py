list = [1,2,2,3,3,3]

#yield is generator(生成器)
import sys

def fibo(n):
	a,b,count = 0,1,0
	while 1:
		if(count > n):
			return
		yield a
		a,b = b, a + b
		count += 1
f = fibo(10)

while 1:
	try:
		print(next(f),end=", ")
	except StopIteration:
		sys.exit()