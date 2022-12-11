CREATE TABLE public.users
(
    id serial NOT NULL,
    name character varying(256),
    email character varying(256),
    password character varying(256),
    store_id integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users
    OWNER to pricing;


CREATE TABLE public.pricing_records
(
    store_id integer,
    sku character varying(256),
    product_name character varying(256),
    price character varying(256),
    date timestamp with time zone
);

ALTER TABLE IF EXISTS public.pricing_records
    OWNER to postgres;

CREATE TABLE public.stores
(
    store_id integer NOT NULL,
    store_name character varying(256),
    store_address character varying(256),
    store_state character varying(256),
    store_zip character varying(256),
    store_country character varying(256),
    store_phone integer,
    PRIMARY KEY (store_id)
);

ALTER TABLE IF EXISTS public.stores
    OWNER to postgres;