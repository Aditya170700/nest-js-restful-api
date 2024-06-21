# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request header :
- Authorization : token

Request Body :
```json
{
  "first_name": "Aditya",
  "last_name": "Ricki",
  "email": "adityaric72Gmail.com",
  "phone": "0892871687312"
}
```

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "first_name": "Aditya",
    "last_name": "Ricki",
    "email": "adityaric72Gmail.com",
    "phone": "0892871687312"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request header :
- Authorization : token

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "first_name": "Aditya",
    "last_name": "Ricki",
    "email": "adityaric72Gmail.com",
    "phone": "0892871687312"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request header :
- Authorization : token

Request Body :
```json
{
  "first_name": "Aditya",
  "last_name": "Ricki",
  "email": "adityaric72Gmail.com",
  "phone": "0892871687312"
}
```

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "first_name": "Aditya",
    "last_name": "Ricki",
    "email": "adityaric72Gmail.com",
    "phone": "0892871687312"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

Request header :
- Authorization : token

Response Body (Success) :
```json
{
  "data": true
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Search Contact

Endpoint : DELETE /api/contacts

Request header :
- Authorization : token

Query Parameter :
- name : string, first_name/last_name, optional
- phone : string, phone, optional
- email : string, email, optional
- page : number, default 1
- size : number, default 10

Response Body (Success) :
```json
{
  "data": [
    {
        "id": 1,
        "first_name": "Aditya",
        "last_name": "Ricki",
        "email": "adityaric72Gmail.com",
        "phone": "0892871687312"
    }
  ],
  "paging": {
    "current_page": 1,
    "size": 1,
    "total_page": 10
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```