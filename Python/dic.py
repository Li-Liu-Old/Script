# -*- coding:UTF-8 -*-

dict = {'key1':333,'key2':222,'key3':111}

dict1 = {'abc':123,99.9:520}

print('dict["key1"]',dict["key1"])
print("dict['abc']",dict1["abc"])

#字典添加
dict['School'] = '菜鸟教程'

print(dict)

del dict['key1']

#删除字典1
#dict.clear()
#删除字典2
del dict

print(dict)

#创建时如果同一个键被赋值两次，后一个值会被记住
dict2 = {'name':'第一个','name':'第二个'}
print(dict2['name'])

