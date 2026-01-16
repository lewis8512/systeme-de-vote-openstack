--
-- PostgreSQL database dump
--

-- Dumped from database version 13.20 (Debian 13.20-1.pgdg120+1)
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Admin_id_seq" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: Candidate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Candidate" (
    id integer NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    party text NOT NULL,
    "electionId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Candidate" OWNER TO postgres;

--
-- Name: Candidate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Candidate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Candidate_id_seq" OWNER TO postgres;

--
-- Name: Candidate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Candidate_id_seq" OWNED BY public."Candidate".id;


--
-- Name: Election; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Election" (
    id integer NOT NULL,
    title text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Election" OWNER TO postgres;

--
-- Name: Election_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Election_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Election_id_seq" OWNER TO postgres;

--
-- Name: Election_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Election_id_seq" OWNED BY public."Election".id;


--
-- Name: Elector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Elector" (
    id integer NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    "idCardNumber" text NOT NULL,
    password text NOT NULL,
    "hasVoted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Elector" OWNER TO postgres;

--
-- Name: Elector_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Elector_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Elector_id_seq" OWNER TO postgres;

--
-- Name: Elector_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Elector_id_seq" OWNED BY public."Elector".id;


--
-- Name: Vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vote" (
    id integer NOT NULL,
    "candidateId" integer NOT NULL,
    "electionId" integer NOT NULL,
    "voteHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Vote" OWNER TO postgres;

--
-- Name: Vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vote_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Vote_id_seq" OWNER TO postgres;

--
-- Name: Vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vote_id_seq" OWNED BY public."Vote".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Name: Candidate id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Candidate" ALTER COLUMN id SET DEFAULT nextval('public."Candidate_id_seq"'::regclass);


--
-- Name: Election id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Election" ALTER COLUMN id SET DEFAULT nextval('public."Election_id_seq"'::regclass);


--
-- Name: Elector id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Elector" ALTER COLUMN id SET DEFAULT nextval('public."Elector_id_seq"'::regclass);


--
-- Name: Vote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote" ALTER COLUMN id SET DEFAULT nextval('public."Vote_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, email, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Candidate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Candidate" (id, name, surname, party, "electionId", "createdAt", "updatedAt") FROM stdin;
1	Emmanuel	MACRON	La République en route	1	2025-03-31 13:05:50.702	2025-03-31 13:04:47.363
2	Jean-Luc	Mélenchon	La République c'est moi	1	2025-03-31 13:06:14.673	2025-03-31 13:05:52.516
3	Jordan	Bardella	Le dérassemblement national	1	2025-03-31 13:07:07.257	2025-03-31 13:06:16.551
\.


--
-- Data for Name: Election; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Election" (id, title, "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
1	Élections présidentielles anticipées de 2027	2025-03-31 06:00:00	2025-04-07 06:00:00	2025-03-31 13:04:40.504	2025-03-31 13:50:21.938
\.


--
-- Data for Name: Elector; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Elector" (id, name, surname, "idCardNumber", password, "hasVoted", "createdAt", "updatedAt") FROM stdin;
2	Bob	Martin	987654321	$argon2i$v=19$m=4096,t=3,p=1$QKI4WsR/lnUPjcVXIinbIQ$qcky4dPnJOWBMHC7AV/e0+zJtIZBkj/Gq7gOUxr/gs8	f	2025-03-31 12:52:40.024	2025-03-31 12:52:40.024
3	Charlie	Lemoine	111222333	$argon2i$v=19$m=4096,t=3,p=1$1YUzKx/RsZxOc4R9UCrIYQ$Y1mKyQdxn+V/eLlpCc7BrwT7QGvlarmnnnHfcjZ2EnA	f	2025-03-31 12:52:40.048	2025-03-31 12:52:40.049
1	Alice	Dupont	123456789	$argon2i$v=19$m=4096,t=3,p=1$kwVlXmTqwp+le9DMbYTauw$TXaaX5F2Tryo6ed8VzJ2Tz3C5RmxrosBMIm+pvsxYeg	t	2025-03-31 12:52:39.959	2025-04-01 07:12:12.726
\.


--
-- Data for Name: Vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vote" (id, "candidateId", "electionId", "voteHash", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
aad48a84-a1ee-4231-ab31-74f35e8ec404	23acc828d3782565650e416414bbe16993c6c23ed99bbf9a05419ed1599984aa	2025-03-31 12:43:47.074371+00	20250331124346_init	\N	\N	2025-03-31 12:43:47.02195+00	1
\.


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, false);


--
-- Name: Candidate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Candidate_id_seq"', 3, true);


--
-- Name: Election_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Election_id_seq"', 1, true);


--
-- Name: Elector_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Elector_id_seq"', 3, true);


--
-- Name: Vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vote_id_seq"', 1, false);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Candidate Candidate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Candidate"
    ADD CONSTRAINT "Candidate_pkey" PRIMARY KEY (id);


--
-- Name: Election Election_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Election"
    ADD CONSTRAINT "Election_pkey" PRIMARY KEY (id);


--
-- Name: Elector Elector_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Elector"
    ADD CONSTRAINT "Elector_pkey" PRIMARY KEY (id);


--
-- Name: Vote Vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: Elector_idCardNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Elector_idCardNumber_key" ON public."Elector" USING btree ("idCardNumber");


--
-- Name: Vote_voteHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vote_voteHash_key" ON public."Vote" USING btree ("voteHash");


--
-- Name: Candidate Candidate_electionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Candidate"
    ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES public."Election"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Vote Vote_candidateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES public."Candidate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vote Vote_electionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES public."Election"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

