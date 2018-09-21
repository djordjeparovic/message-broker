
module.exports = {
  prepare_schema: `
    BEGIN;
    create table if not exists topic (
      name varchar(500) primary key,
      createdat timestamp not null default current_timestamp
    );

    insert into topic (name) values ('hello') on conflict (name) do nothing;

    create table if not exists topic_hello (
      id serial primary key,
      createdat timestamp not null default current_timestamp,
      message json,
      available integer not null
    );

    create table if not exists consumer (
        name varchar(500) primary key,
        createdat timestamp not null default current_timestamp
    );

    create table if not exists consumer_topic (
        consumer_name varchar(500) references consumer (name),
        topic_name varchar(500) references topic (name),
        topic_position integer not null default 0,
        PRIMARY KEY(consumer_name, topic_name)
    );
    COMMIT;
    `,
  // available represents how many clients can read message, -1 represents infinity
  publish: `
    BEGIN;
    insert into topic (name) values ('$1') on conflict do nothing;
    create table if not exists topic_$1 (
        id serial primary key,
        createdat timestamp not null default current_timestamp,
        message json,
        available integer not null
    );
    insert into topic_$1 (message, available) values ('$2', $3);
    COMMIT;
  `,
  list_topics: `
    select name from topic;
  `,
  fetch: [
    `update topic_$1 set available = available - 1 
    where id in (select id from topic_$1 where available > -1 and id > $2 and id <= $3 order by id limit 1);`,
    `select createdat, message from topic_$1 
     where available != -1 and id > $2 and id <= $3 order by id limit 1;`,
  ],
  consumer_position: `
    select topic_position from consumer_topic where topic_name = '$1' and consumer_name = '$2';
  `,
  update_consumer_position: ` -- $1 = topic, $2 = consumer, $3 = position
    begin;
    insert into consumer (name) values ('$2') on conflict do nothing;
    insert into consumer_topic (consumer_name, topic_name, topic_position) values ('$2','$1',$3)
    on conflict (consumer_name, topic_name)
    do update set topic_position = $3;
    commit;
  `,
};
