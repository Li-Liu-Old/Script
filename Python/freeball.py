# -*- coding:UTF-8 -*-

tour = []
height10 = []

H = 100
tim = 10

for i in range(1,tim+1):
	if i == 1:
		tour.append(H)
	else:
		tour.append(2*H)
	H /= 2
	height10.append(H)
	
print(sum(tour))

print(height10[-1])