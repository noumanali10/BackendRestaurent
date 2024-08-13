// Read Me File 

Important Every Route Header is Content Type: Application/Json

Request Get &&  http://localhost:5000
Response Hello World 

// Table Routes

1- Create New Table 

Request Post && http://localhost:5000/api/tables

Required Fields 

{
    "name": "Table 7",
    "seat": 4 
}

Response 

{
    "name": "Table 7",
    "seat": 4,
    "_id": "66bae7a2be0468296b84ce16",
    "__v": 0
}

2- Get All Tables 

Request get && http://localhost:5000/api/tables

[
    {
        "_id": "66b9e76bede2c5db75e694fb",
        "name": "Table 1",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66b9e772ede2c5db75e694fd",
        "name": "Table 2",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66b9e777ede2c5db75e694ff",
        "name": "Table 3",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66b9e782ede2c5db75e69501",
        "name": "Table 4",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66b9e787ede2c5db75e69503",
        "name": "Table 5",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66b9e78cede2c5db75e69505",
        "name": "Table 6",
        "seat": 4,
        "__v": 0
    },
    {
        "_id": "66bae7a2be0468296b84ce16",
        "name": "Table 7",
        "seat": 4,
        "__v": 0
    }
]

Get all reserve table 

Request Post && http://localhost:5000/api/reserve/bookedtables

{
    "date": "2024-08-24",
    "slot": "8:00 PM - 9:00 PM"
}

Response

{
    "bookedTables": [
        {
            "tableId": "66b9e78cede2c5db75e69505",
            "tableName": "Table 6",
            "available": true
        },
        {
            "tableId": "66b9e787ede2c5db75e69503",
            "tableName": "Table 5",
            "available": true
        }
    ]
}

For Reservation Table 

Request Post && http://localhost:5000/api/reserve

{
    "customerName": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "date": "2024-08-24",
    "slot": "9:00 PM - 10:00 PM",
    "tableId": "66b9e78cede2c5db75e69505"
}

Response If Booking Exist

{
    "msg": "The selected table is already reserved for the chosen slot"
}

Response If Not Exist

{
    "msg": "Reservation created successfully",
    "reservation": {
        "customerName": "John Doe",
        "phone": 1234567890,
        "email": "john@example.com",
        "date": "2024-08-25T00:00:00.000Z",
        "slot": "9:00 PM - 10:00 PM",
        "table": "66b9e78cede2c5db75e69505",
        "available": true,
        "_id": "66bae97fbe0468296b84ce27",
        "createdAt": "2024-08-13T05:05:03.952Z",
        "__v": 0
    }
}

Also Send Mail Manager and Customer Same time so repone might be delay 


