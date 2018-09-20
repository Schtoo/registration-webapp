drop table reg_plates;
create table reg_plates(
    id serial not null primary key;,
    towns text not null unique,
    starts_with text not null
);

create table plates(
    id serial not null primary key,
    numbers int,
    towns_id foreign key
);