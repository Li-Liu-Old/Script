# -*- coding:UTF-8 -*-

import time

print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))

#延迟3s输入
#time.sleep(3)

#input
#name = input()

namelist = ['liu','li','liuli']

print(namelist)

#namelist.append(name)

print(namelist)

namelist.insert(0,'firstname')

print(namelist)

namelist.pop()

print(namelist)
print('这是删除list末尾')

namelist.pop(0)
print(namelist)
print('delete firstname')

ListA = ['1','2','3']
namelist[0] = ListA

print(namelist)
print(len(namelist))

ListB = ListA + namelist
print(ListB)
print(len(ListB))

ListC = ListA*3
print(ListC)
print(len(ListC))

del ListA
print(ListA)

print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))