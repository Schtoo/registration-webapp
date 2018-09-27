drop table if exits towns, plates;
create table towns(
    id serial not null primary key,
    town_name text not null unique,
    starts_with text not null
);

create table plates(
    id serial not null primary key,
    numbers int,
    towns_id int,
    foreign key(towns_id) references towns(id)
);

INSERT INTO towns (town_name, starts_with) values ('Cape Town', 'ca');
INSERT INTO towns (town_name, starts_with) values('Worcester', 'cw');
INSERT INTO towns (town_name, starts_with) values('Bellville', 'cy');
INSERT INTO towns (town_name, starts_with) values('Malmesbury', 'ck');
