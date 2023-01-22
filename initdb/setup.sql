set client_encoding = 'UTF8';

-- ユーザーテーブル
create table users(
    id UUID primary key,
    name varchar(20) not null,
    mail varchar(255) unique not null,
    age integer not null,
    gender boolean not null, -- true : 男　false: 女
    created_at TIMESTAMP NOT NULL  DEFAULT  CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL  DEFAULT  CURRENT_TIMESTAMP
);
-- 残高テーブル
create table wallets(
    id serial primary key ,
    user_id UUID not null,
    balance numeric not null DEFAULT 0 CHECK(balance >= 0),
    created_at TIMESTAMP NOT  NULL  DEFAULT  CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT  NULL  DEFAULT  CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 取引記録テーブル
create table transactions(
    id serial primary key,
    user_id UUID not null,
    transaction_amount numeric not null,
    created_at TIMESTAMP NOT  NULL  DEFAULT  CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT  NULL  DEFAULT  CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 更新日時設定
CREATE FUNCTION set_time() RETURNS opaque AS '
  begin
    new.updated_at := ''now'';
    return new;
  end;
' LANGUAGE plpgsql;
-- 残高情報初期化
CREATE FUNCTION init_wallet() RETURNS TRIGGER AS '
  begin
    INSERT INTO "public"."wallets" ("user_id") VALUES (NEW.id);
    return null;
  end;
' LANGUAGE plpgsql;
-- 取引が発生したとき取引記録
CREATE FUNCTION insert_transaction_record() RETURNS TRIGGER AS '
  DECLARE

   subtract_result numeric := 0;
   transaction_amount numeric := 0;
  
  begin
    IF (NEW.created_at != NEW.updated_at) THEN

        subtract_result = OLD.balance - NEW.balance;
        transaction_amount = subtract_result * -1;
        INSERT INTO "public"."transactions" ("user_id", "transaction_amount") VALUES (NEW.user_id, transaction_amount);
    
    END IF;
    return null;
  end;
' LANGUAGE plpgsql;

--各trigger
CREATE TRIGGER update_user BEFORE UPDATE  ON  users FOR EACH ROW  EXECUTE  PROCEDURE set_time();
CREATE TRIGGER update_wallet BEFORE UPDATE  ON  wallets FOR EACH ROW  EXECUTE  PROCEDURE set_time();
CREATE TRIGGER insert_transaction_record AFTER UPDATE  ON  wallets FOR EACH ROW  EXECUTE  PROCEDURE insert_transaction_record();
CREATE TRIGGER insert_init_wallet AFTER INSERT ON users FOR EACH ROW  EXECUTE  PROCEDURE init_wallet();