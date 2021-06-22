System TODO
Opis
Stwórz TODO LIST z rejestracją i logowaniem. 

Każdy użytkownik ma swoją tablicę.
Dane i sesja trzymane są w bazie danych PostgreSQL

Stack technologiczny
WSL (Windows Subsystem Linux) lub Debian 10
NodeJS w najnowszej stabilnej wersji
Rest
uWebsocket.js https://github.com/uNetworking/uWebSockets.js
lub
nanoexpress https://github.com/nanoexpress/nanoexpress

Baza danych 
PostgreSQL (najnowsza wersja)

pg-promise https://github.com/vitaly-t/pg-promise
lub
slonik https://github.com/gajus/slonik

Endpointy
auth/register/
/auth/login
/todo/get
/todo/list
/todo/add
/todo/delete
/todo/update


Dodatkowe wymagania
Aplikacja powinna być testowana w Postman, kolekcja powinna być umieszczona w repo
użyć eslint
sesja powinna żyć 7 dni
w bazie danych powinny znaleźć się 3 schemy - account, catalog, session
zachowaj wszelkie wymagania z tego dokumentu:
https://docs.google.com/document/d/1dI49gfB02M3Aex6_l3G_ka4aznB1hdlyhJJyckpDhds/edit
aplikacja powinna startować z pm2 (dodaj app.json)

