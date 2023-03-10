## 環境構築

```
docker-compose build
```

## 起動

```
docker-compose up
```

## er 図

![Test Image 1](./app/assets/wallet_db%20-%20public.png)

## api 情報

|                                | メソッド | URI               |
| ------------------------------ | -------- | ----------------- |
| ユーザー情報登録               | POST    | /account/sign-up  |
| ユーザーの残高・取引記録取得   | POST     | /account/info     |
| 指定した分を残高から引く       | POST     | /transaction/sell |
| 指定した分を残高から足す       | POST     | /transaction/buy  |
| 指定した分を残高から相手に送る | POST     | /transaction/send |

### /account/sign-up

```
//BODY:JSON
{
    "name": string,
    "mail": string,
    "age": numeric,
    "gender": boolean
}
```

### /account/info

```
//BODY:JSON
{
    "id": UUID
}
```

### /transaction/sell

```
//BODY:JSON
{
    "id": UUID,
    "amount": numeric,
}
```

### /transaction/buy

```
//BODY:JSON
{
    "id": UUID,
    "amount": numeric,
}
```

### /transaction/send

```
//BODY:JSON
{
    "id": UUID,
    "amount": numeric,
    "takerId": UUID
}
```
