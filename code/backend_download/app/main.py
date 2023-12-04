from flask import Flask
from flask import request
from flask_cors import CORS
import json

from google.cloud import bigtable
from google.cloud.bigtable import column_family
from google.cloud.bigtable import row_filters
from google.cloud import bigtable
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './root-engine-349303-4bbbea9a1ff7.json'

app = Flask(__name__)
CORS(app)

# project_id="root-engine-349303", instance_id="animal", table_id="animal"
def get_bigtable(row_key, cf_id, col_id_list, project_id="root-engine-349303", instance_id="animal", table_id="animal"):
    # Create a Cloud Bigtable client.
    client = bigtable.Client(project=project_id, admin=True)

    # Connect to an existing Cloud Bigtable instance.
    instance = client.instance(instance_id)

    # Open an existing table.
    table = instance.table(table_id)

    row = table.read_row(row_key.encode("utf-8")) # row_key = "O#P#P"
    # print(row)

    column_family_id = cf_id #"chicken"
    value_dict = {}
    for col_id in col_id_list:
        column_id = col_id.encode("utf-8") #"picture".encode("utf-8")
        # try:
        value = row.cells[column_family_id][column_id][0].value.decode("utf-8")
        # print("Row key: {}\nData: {}".format(row_key, value))
        value_dict[col_id] = value
    # except KeyError:
    #     column_id = "picture".encode("utf-8")
        # value = row.cells[column_family_id][column_id][0].value.decode("utf-8")
    
    return value_dict

# def get_unique_animals(row_key, project_id="root-engine-349303", instance_id="animal", table_id="animal"):
#     # Create a Cloud Bigtable client.
#     client = bigtable.Client(project=project_id, admin=True)

#     # Connect to an existing Cloud Bigtable instance.
#     instance = client.instance(instance_id)

#     # Open an existing table.
#     table = instance.table(table_id)
#     cf_list = table.list_column_families()
#     # print(len(cf_list))
#     # print(cf_list)

#     genre_list = []
#     name_list = []
#     pic_list = []
#     round_list = []
#     for cf in cf_list:
#         genre_list.append(cf)
#         row = table.read_row(row_key.encode("utf-8"))

#         column_id = "name".encode("utf-8")
#         value = row.cells[cf][column_id][0].value.decode("utf-8")
#         name_list.append(value)
#         column_id = "picture".encode("utf-8")
#         value = row.cells[cf][column_id][0].value.decode("utf-8")
#         pic_list.append(value)
#         column_id = "round".encode("utf-8")
#         value = row.cells[cf][column_id][0].value.decode("utf-8")
#         round_list.append(value)
        

#     return genre_list, name_list, pic_list, round_list

# @app.route("/get_info", methods=['POST'])
# def get_info():
#     request_data = request.get_json()
#     animal = request_data['animal']
#     history = request_data['history']
#     isEnd = request_data['isEnd']

#     col_list = ["name","picture"]
#     # data = {
#     #     "name": name,
#     #     "picture": picture,
#     # }
#     if history == "O":
#         # rounds = get_bigtable(history, animal, "round")
#         # data['round'] = rounds
#         col_list.append("round")
#     if isEnd:
#         # doc = get_bigtable(history, animal, "doc")
#         # data['doc'] = doc
#         col_list.append("doc")
#     values = get_bigtable(history, animal, col_list)
    
#     return json.dumps(values)

@app.route('/')
def home():
    return 'Hello World!'

@app.route("/download", methods=['POST'])
def download():
    request_data = request.get_json()
    animal = request_data['animal']
    history = request_data['history']
    endpic = get_bigtable(history, animal, ['endpic'])
    # data = {
    #     'endpic': endpic
    # }

    return json.dumps(endpic)

# @app.route("/get_animals", methods=['POST'])
# def get_animals():
#     genre_list, name_list, pic_list, round_list = get_unique_animals("O")
#     data = {
#         'animals': []
#     }
#     for i in range(len(genre_list)):
#         animal_dict = {}
#         animal_dict['genre'] = genre_list[i]
#         animal_dict['name'] = name_list[i]
#         animal_dict['picture'] = pic_list[i]
#         animal_dict['round'] = round_list[i]
#         data['animals'].append(animal_dict)

#     return json.dumps(data)

if __name__ == '__main__':
    # serve(app, host="0.0.0.0", port=5000)
    # app.debug = True
    app.run()
    


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(
#         description=__doc__, formatter_class=argparse.ArgumentDefaultsHelpFormatter
#     )
#     parser.add_argument("project_id", help="Your Cloud Platform project ID.")
#     parser.add_argument(
#         "instance_id", help="ID of the Cloud Bigtable instance to connect to."
#     )
#     parser.add_argument(
#         "--table", help="Existing table used in the quickstart.", default="animal"
#     )

#     args = parser.parse_args()
#     main(args.project_id, args.instance_id, args.table)