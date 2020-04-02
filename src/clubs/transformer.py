from os import listdir
from os.path import isfile, join
mypath = "C:\\Users\\Ward\\Desktop\\football-game\\src\\clubs"
folders = [f for f in listdir(mypath)]
team_paths = []
for folder in folders:
    if folder not in ["transformer.py", "clubs.js"]:
        c_path = mypath + "\\" + folder
        only_files = [f for f in listdir(c_path) if isfile(join(c_path, f))]
        for file in only_files:
            team_paths.append(join(c_path, file))
#print(team_paths)


current_id = [1, 1001, 2001]
def get_current_id(ind):
    global current_id
    id = current_id[ind-1]
    current_id[ind-1] = id + 1
    return id

class jsDict(object):
    def __init__(self):
        self.d = {}

    def register_entry(self, index, value):
        self.d[index] = value

    def access_entry(self, index):
        return self.d[index]

    def print_self(self):
        print(self.d)

    def write_self(self, f, lll):
        #f.write("export " + self.d["name"] + " = {\n")
        f_switch = True
        olll = lll
        keys = self.d.keys()
        for key in keys:
            if f_switch:
                lll = 0
                f_switch = False
            else:
                lll = olll
            f.write((lll * " ") + key + ": \"" + str(self.d[key]) + "\",\n")
        #f.write("}\n")

def file_to_dict(f):
    team_dict = jsDict()
    players_dict_list = []

    c_id = get_current_id(1)
    line = f.readline()
    cells = line.split(";")
    team_dict.register_entry("fullName", cells[0])
    team_dict.register_entry("name", cells[1])
    team_dict.register_entry("nationality", cells[2][:-1:])
    team_dict.register_entry("id", c_id)

    c_id = get_current_id(2)
    coach_dict = jsDict()
    line = f.readline()
    cells = line.split(";")
    coach_dict.register_entry("id", c_id)
    coach_dict.register_entry("name", cells[0])
    coach_dict.register_entry("position", 'C')
    coach_dict.register_entry("nationality", cells[1])
    team_dict.register_entry("coach", c_id)
    players_dict_list.append(coach_dict)

    line = f.readline()
    cells = line.split(";")
    team_dict.register_entry("color1", str(cells[0]))
    team_dict.register_entry("color2", str(cells[1]))
    team_dict.register_entry("strength", cells[2][:-1:])

    players_id_list = []
    team_dict.register_entry("players", players_id_list)
    line = f.readline()
    while line != "":
        c_id = get_current_id(3)
        cells = line.split(";")
        player_dict = jsDict()
        player_dict.register_entry("id", c_id)
        player_dict.register_entry("name", cells[0])
        player_dict.register_entry("position", cells[1])
        player_dict.register_entry("nationality", cells[2][:-1:])
        players_id_list.append(c_id)
        players_dict_list.append(player_dict)
        line = f.readline()
    return players_dict_list + [team_dict]


o = open('clubs.js', "w+")
first_line = "export let all_info = {"
l = len(first_line)
o.write(first_line)
club_test = open(team_paths[0], 'r')
ds = file_to_dict(club_test)
first_switch = True
for e in ds:
    e.print_self()
for e in ds:
    id_part = str(e.access_entry("id")) + ": {"
    if first_switch:
        o.write(id_part)
        first_switch = False
    else:
        o.write(" " * l + id_part)
    ll = l + len(id_part)
    e.write_self(o, ll)
    o.write(" " * ll +  "},\n")

o.write("}")
