x = 10
y = 12
#ifµÄÊ¹ÓÃ
print("pls input a number")

while 1:
	num = int(input("GUESS:"))
	if num >= y:
		print('this num is too big!')
	elif num <= x:
		print('this num is too small!')
	else:
		print('congratulations!U R right!')
		break