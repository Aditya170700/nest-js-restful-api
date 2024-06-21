# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:idContact/addresses

Request header :
- Authorization : token

Request Body :
```json
{
  "street": "St. Street",
  "city": "City",
  "province": "Province",
  "country": "Country",
  "postal_code": "55555"
}
```

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "street": "St. Street",
    "city": "City",
    "province": "Province",
    "country": "Country",
    "postal_code": "55555"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Get Address

Endpoint : GET /api/contacts/:idContact/addresses/:idAddress

Request header :
- Authorization : token

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "street": "St. Street",
    "city": "City",
    "province": "Province",
    "country": "Country",
    "postal_code": "55555"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Update Address

Endpoint : PATCH /api/contacts/:idContact/addresses/:idAddress

Request header :
- Authorization : token

Request Body :
```json
{
  "street": "St. Street",
  "city": "City",
  "province": "Province",
  "country": "Country",
  "postal_code": "55555"
}
```

Response Body (Success) :
```json
{
  "data": {
    "id": 1,
    "street": "St. Street",
    "city": "City",
    "province": "Province",
    "country": "Country",
    "postal_code": "55555"
  }
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:idContact/addresses/:idAddress

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

## List Address

Endpoint : GET /api/contacts/:idContact/addresses

Request header :
- Authorization : token

Response Body (Success) :
```json
{
  "data": [
    {
        "id": 1,
          "street": "St. Street",
          "city": "City",
          "province": "Province",
          "country": "Country",
          "postal_code": "55555"
    }
  ]
}
```

Response Body (Failed) :
```json
{
  "errors": "Message"
}
```