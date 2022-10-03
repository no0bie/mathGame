from flask import Flask, json, request
from datetime import datetime
import sqlite3
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('test.db')
c = conn.cursor()

sessions = {}

@app.route('/')
def printe():
    return "base"

@app.route('/leaderboard', methods=['GET'])
def getLeaderboard():
    rows = []
    cursor = c.execute('SELECT * FROM leaderboard ORDER BY Score DESC;')
    for row in cursor:
        rows.append(row)

    return json.dumps({"leaderboard": rows})


@app.route('/add-score', methods=['POST'])
def addScore():
    data = request.json
    try:
        user = data['usern']
        score = data['score']
        value = data['value']

    except:
        return json.dumps("bad call")

    try:
        if user in sessions:
            if sessions[user] == value:
                c.execute('INSERT INTO leaderboard (uName, Score) VALUES (?, ?);', (user, score))
                conn.commit()
            else:
                return json.dumps("Invalid session 2")
        else:
            return json.dumps("Invalid session 1")

    except:
        return json.dumps("user already exists")

    return json.dumps("OK")

@app.route('/add-user', methods=['POST'])
def addUsers():
    data = request.json
    try:
        user = data['usern']
        passw = data['passwd']

    except:
        return json.dumps("bad call")

    try:
        c.execute('INSERT INTO users (uName, passW) VALUES (?, ?);', (user, passw))
        conn.commit()

    except:
        return json.dumps("user already exists")

    return json.dumps("OK")


@app.route('/get-user', methods=['POST'])
def getUser():

    data = request.json
    retTok = ""
    retVal = 0
    try:
        user = data['usern']
        passw = data['passwd']
    except:
        return json.dumps("bad call")

    cursor = c.execute('SELECT * FROM users WHERE uName=? AND passW=?', (user, passw))
    for row in cursor:
        retTok = row[0]

    if retTok:
        retVal = random.randint(100000,100000*100000);
        sessions[retTok] = retVal

    return json.dumps({"token": retTok, "value": retVal})

@app.route('/table')
def addTable():
    c.execute('DROP TABLE users;')
    conn.commit()
    c.execute('CREATE TABLE users (uName varchar(255) NOT NULL PRIMARY KEY, passW varchar(255) NOT NULL);')
    return "created"


@app.route('/table-l')
def addTableL():
    c.execute('DROP TABLE leaderboard;')
    conn.commit()
    c.execute('CREATE TABLE leaderboard (uName varchar(255) NOT NULL, Score INT NOT NULL);')
    return "created"


