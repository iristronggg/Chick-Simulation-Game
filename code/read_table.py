import os
import sys

data = 'BigTable_Data.csv'
# dlist = []
with open(data) as f:
        for line in f.read().splitlines()[1:]:
                [rowID, cf, cq, value] = line.split(",")
                if value != 'X':
                    # cbt set <table> <rowID> <colFamily>:<colQualifier>=<value>
                    CMD = "cbt set animal "+rowID+" "+cf+":"+cq+"="+"'"+value+"'"     # your cbt command
                    # print(CMD)
                    os.system(CMD)