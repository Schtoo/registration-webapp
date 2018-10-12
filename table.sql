drop table if exists towns, plates cascade;
create table towns(
    id serial not null primary key,
    town_name text not null unique,
    starts_with text not null
);

create table plates(
    id serial not null primary key,
    registration text,
    towns_id int,
    foreign key(towns_id) references towns(id)
);

INSERT INTO towns (town_name, starts_with) values ('Cape Town', 'CA');
INSERT INTO towns (town_name, starts_with) values('Worcester', 'CW');
INSERT INTO towns (town_name, starts_with) values('Bellville', 'CY');
INSERT INTO towns (town_name, starts_with) values('Malmesbury', 'CK');