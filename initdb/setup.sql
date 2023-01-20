set client_encoding = 'UTF8';

set client_encoding = 'UTF8';

create table users(
    id serial primary key,
    name varchar(20) not null,
    mail varchar(255) unique not null,
    age integer not null,
    gender boolean not null,
    create_date date not null,
    update_date date not null
);

create table wallets(
    id serial primary key,
    user_id serial not null,
    balance money not null,
    variations_in_the_amount_of_once money not null,
    create_date date not null,
    update_date date not null,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
