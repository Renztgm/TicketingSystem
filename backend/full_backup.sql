--
-- PostgreSQL database dump
--

\restrict SESz7sH0J9ZeQgfsH2W4vuwukIeelIk4lGirhIRNqddqUJ15auAJC59PL7QpoX1

-- Dumped from database version 16.15 (ef25dd3)
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: neon_auth
--

CREATE SCHEMA neon_auth;


ALTER SCHEMA neon_auth OWNER TO neon_auth;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Category; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Category" AS ENUM (
    'GENERAL',
    'BUG',
    'FEATURE_REQUEST',
    'ACCOUNT',
    'BILLING',
    'OTHER'
);


ALTER TYPE public."Category" OWNER TO neondb_owner;

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Priority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."Priority" OWNER TO neondb_owner;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'AGENT',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO neondb_owner;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Status" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
    'PENDING'
);


ALTER TYPE public."Status" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" uuid NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE neon_auth.account OWNER TO neon_auth;

--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    email text NOT NULL,
    role text,
    status text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" uuid NOT NULL
);


ALTER TABLE neon_auth.invitation OWNER TO neon_auth;

--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.jwks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone
);


ALTER TABLE neon_auth.jwks OWNER TO neon_auth;

--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE neon_auth.member OWNER TO neon_auth;

--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "createdAt" timestamp with time zone NOT NULL,
    metadata text
);


ALTER TABLE neon_auth.organization OWNER TO neon_auth;

--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.project_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    endpoint_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trusted_origins jsonb NOT NULL,
    social_providers jsonb NOT NULL,
    email_provider jsonb,
    email_and_password jsonb,
    allow_localhost boolean NOT NULL,
    plugin_configs jsonb,
    webhook_config jsonb
);


ALTER TABLE neon_auth.project_config OWNER TO neon_auth;

--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid NOT NULL,
    "impersonatedBy" text,
    "activeOrganizationId" text
);


ALTER TABLE neon_auth.session OWNER TO neon_auth;

--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    banned boolean,
    "banReason" text,
    "banExpires" timestamp with time zone
);


ALTER TABLE neon_auth."user" OWNER TO neon_auth;

--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: neon_auth
--

CREATE TABLE neon_auth.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE neon_auth.verification OWNER TO neon_auth;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: conversation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversation (
    id text NOT NULL,
    name character varying(255),
    is_group boolean DEFAULT false NOT NULL,
    created_by text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.conversation OWNER TO neondb_owner;

--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversation_participants (
    id integer NOT NULL,
    conversation_id text NOT NULL,
    user_id text NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL,
    is_admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.conversation_participants OWNER TO neondb_owner;

--
-- Name: conversation_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.conversation_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversation_participants_id_seq OWNER TO neondb_owner;

--
-- Name: conversation_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.conversation_participants_id_seq OWNED BY public.conversation_participants.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    conversation_id text NOT NULL,
    sender_id text NOT NULL,
    content text NOT NULL,
    send_at timestamp without time zone DEFAULT now() NOT NULL,
    is_edited boolean DEFAULT false NOT NULL
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tickets (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    priority public."Priority" DEFAULT 'MEDIUM'::public."Priority" NOT NULL,
    category public."Category" DEFAULT 'GENERAL'::public."Category" NOT NULL,
    status public."Status" DEFAULT 'OPEN'::public."Status" NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "Assigned_to" text
);


ALTER TABLE public.tickets OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: conversation_participants id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants ALTER COLUMN id SET DEFAULT nextval('public.conversation_participants_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.invitation (id, "organizationId", email, role, status, "expiresAt", "createdAt", "inviterId") FROM stdin;
\.


--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.jwks (id, "publicKey", "privateKey", "createdAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.member (id, "organizationId", "userId", role, "createdAt") FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.organization (id, name, slug, logo, "createdAt", metadata) FROM stdin;
\.


--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.project_config (id, name, endpoint_id, created_at, updated_at, trusted_origins, social_providers, email_provider, email_and_password, allow_localhost, plugin_configs, webhook_config) FROM stdin;
cb492b71-af77-418c-a6a0-5634203244f7	TicketingSystem	ep-billowing-sky-aopf044c	2026-06-06 12:37:45.157+00	2026-06-06 12:37:45.157+00	[]	[{"id": "google", "isShared": true}]	{"type": "shared"}	{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}	t	{"magicLink": {"config": {"expiresIn": 5, "disableSignUp": false}, "enabled": false}, "phoneNumber": {"config": {"otp_expires_in": 300}, "enabled": false}, "organization": {"config": {"creatorRole": "owner", "membershipLimit": 100, "organizationLimit": 10, "sendInvitationEmail": false}, "enabled": true}}	{"enabled": false, "enabledEvents": [], "timeoutSeconds": 5}
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy", "activeOrganizationId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, banned, "banReason", "banExpires") FROM stdin;
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

COPY neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8212891a-c109-49a6-ba67-4307513026f6	33ba103efb39e2f1ff6c1c7d498bf22d2cc22921f8185a8a11692eace87affe0	2026-07-07 06:55:15.858903+00	20260518171009_init_users_table	\N	\N	2026-07-07 06:55:15.466406+00	1
b78b3047-9f76-430d-9ae8-a1eb79336657	51de4f7309bd327002af11a8e09c6e0d3a8f1f117143c4631214e1434c3a3146	2026-07-07 06:55:16.410586+00	20260519155511_init_user_model	\N	\N	2026-07-07 06:55:15.985438+00	1
90bb8787-eebb-4898-a512-d1bf858a43d9	f57f2263a886fe4ac3f8475b9526e904d96f81211c104ee01c6223484f53910a	2026-07-07 06:55:17.004103+00	20260704182535_init_tickets_table	\N	\N	2026-07-07 06:55:16.55426+00	1
\.


--
-- Data for Name: conversation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.conversation (id, name, is_group, created_by, created_at) FROM stdin;
TKT-20260806-FA69779A37	Hala ung anoo	f	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-06 11:59:28.207
TKT-20260806-39F045D3BE	Walang Internet dito	f	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-06 12:02:55.277
TKT-20260809-45C5976AB9	Conversation Ticket para kay sakalam na si riu	f	677e4e23-07a8-40e8-b019-344eb5bf2fca	2026-08-09 17:22:26.384
TKT-20260810-0676EDDD15	Panibagong Conversation	f	677e4e23-07a8-40e8-b019-344eb5bf2fca	2026-08-10 08:52:33.411
TKT-20260810-91393E1437	TKT-20260810-0676EDDD15	f	8f838b96-0204-4492-8c0a-2c997a34f358	2026-08-10 09:13:53.009
TKT-20260810-F6FA185F1B	Issue about internet service	f	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-10 09:21:10.315
TKT-20260810-57C26DA1E3	SIRE YUNG IACOND HIND GUMUGANA	f	8f838b96-0204-4492-8c0a-2c997a34f358	2026-08-10 09:36:17.917
\.


--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.conversation_participants (id, conversation_id, user_id, joined_at, is_admin) FROM stdin;
1	TKT-20260806-FA69779A37	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-06 11:59:28.207	t
4	TKT-20260806-39F045D3BE	4a5280c8-b745-46f5-8b84-cad04bf60c05	2026-08-06 13:14:16.928449	f
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, conversation_id, sender_id, content, send_at, is_edited) FROM stdin;
2	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	Kamusta po!	2026-08-06 12:24:54.009	f
3	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	Pakibilisan po ayusin ung internet namin!!!	2026-08-06 12:52:56.604	f
4	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	hello	2026-08-09 07:37:59.797	f
5	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	hello	2026-08-09 07:48:45.341	f
6	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	asdlasasdasd	2026-08-09 07:49:11.255	f
7	TKT-20260806-39F045D3BE	67f0138c-3cc3-4790-b467-6efdaeda77cb	testing 2	2026-08-09 07:54:46.626	f
8	TKT-20260806-39F045D3BE	de57d726-3db6-4e26-bdb0-2ebc8f767196	hi!	2026-08-09 17:12:23.517	f
9	TKT-20260806-FA69779A37	67f0138c-3cc3-4790-b467-6efdaeda77cb	Hello po!	2026-08-09 17:17:46.219	f
10	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Riu AHAHHAA	2026-08-09 17:22:51.213	f
11	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hwyahahahahaa	2026-08-09 17:26:49.663	f
12	TKT-20260806-39F045D3BE	677e4e23-07a8-40e8-b019-344eb5bf2fca	test	2026-08-10 04:34:07.292	f
13	TKT-20260806-FA69779A37	677e4e23-07a8-40e8-b019-344eb5bf2fca	Ano yung ano?	2026-08-10 04:35:36.85	f
14	TKT-20260806-39F045D3BE	677e4e23-07a8-40e8-b019-344eb5bf2fca	testing user admin	2026-08-10 04:39:28.435	f
15	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello po	2026-08-10 04:58:10.667	f
16	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	yogg	2026-08-10 04:59:39.001	f
17	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	why boss	2026-08-10 05:00:01.352	f
18	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	tinetesting lang kung may issue parin pagnagsend	2026-08-10 05:01:46.066	f
19	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	ahh check ko nga	2026-08-10 05:02:02.18	f
20	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	try nga ulit natin	2026-08-10 05:08:27.722	f
21	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	hilo	2026-08-10 05:09:09.296	f
22	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	trying namin ulit bos	2026-08-10 05:15:14.599	f
23	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Unknown number	2026-08-10 05:15:51.869	f
24	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	there is unknown sender.	2026-08-10 05:17:09.127	f
25	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hilo	2026-08-10 05:20:46.165	f
26	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	hi poo	2026-08-10 05:20:55.534	f
27	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	bakit anong nangyari?	2026-08-10 05:21:09.25	f
28	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	ayun ayus na hahahah	2026-08-10 05:21:16.473	f
29	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	Ayun ayus naaaaa	2026-08-10 05:21:41.006	f
30	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	tangina mo kasi ehh kung anong ginagawa mo!!!	2026-08-10 05:21:54.977	f
31	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hehehehe	2026-08-10 05:54:30.587	f
32	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	what happened?	2026-08-10 05:54:49.415	f
33	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	hallo	2026-08-10 05:59:59.079	f
34	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	yow	2026-08-10 06:02:15.825	f
35	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	ang galing	2026-08-10 06:02:27.292	f
36	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	hehehe	2026-08-10 06:02:42.352	f
37	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	New Bug: Double sent message but one registered	2026-08-10 06:03:07.854	f
38	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hala why	2026-08-10 06:03:15.303	f
39	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	yow	2026-08-10 06:10:19.088	f
40	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hehhe	2026-08-10 06:10:25.239	f
41	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	ano nato	2026-08-10 06:10:33.5	f
42	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hays	2026-08-10 06:10:52.438	f
43	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	wh?	2026-08-10 06:11:15.575	f
44	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	ano nan nangyayari	2026-08-10 06:11:30.621	f
45	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	di ko rin knows eh	2026-08-10 06:11:37.034	f
46	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	testing 123	2026-08-10 06:12:01.14	f
47	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	testes	2026-08-10 06:13:07.202	f
48	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	tanginaaa	2026-08-10 06:13:14.611	f
49	TKT-20260806-FA69779A37	677e4e23-07a8-40e8-b019-344eb5bf2fca	Hehehe	2026-08-10 06:15:19.956	f
50	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	sdfsdfsdfsdf	2026-08-10 06:16:32.252	f
51	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	kkk	2026-08-10 06:16:40.341	f
52	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	test	2026-08-10 06:19:12.869	f
53	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	testinng ulit using socket.io lib	2026-08-10 06:22:18.178	f
54	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	2nd test lib	2026-08-10 06:23:32.765	f
55	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	yow magreflect ka	2026-08-10 06:23:48.569	f
56	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	luh	2026-08-10 06:24:12.795	f
57	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	try ulit	2026-08-10 06:25:14.036	f
58	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	what the fack	2026-08-10 06:25:25.803	f
59	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	sget	2026-08-10 06:25:59.338	f
60	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	the fack	2026-08-10 06:26:07.95	f
61	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	nakjsgkdjaskdasd	2026-08-10 06:26:16.49	f
62	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	The fuck	2026-08-10 06:27:14.63	f
63	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	eyy	2026-08-10 06:31:08.941	f
64	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	hays	2026-08-10 06:32:06.634	f
65	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	ano naa	2026-08-10 06:32:22.201	f
66	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	tangina yan	2026-08-10 06:32:39.163	f
67	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hellpo	2026-08-10 06:32:47.384	f
68	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	ano na?	2026-08-10 06:34:29.908	f
69	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	di ko na alam	2026-08-10 06:34:38.742	f
70	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	try natin ulit	2026-08-10 06:38:31.098	f
71	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	ano kaya yun	2026-08-10 06:38:37.696	f
72	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Hays	2026-08-10 06:42:51.403	f
73	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Nagluluko HAHAHA	2026-08-10 06:43:00.388	f
74	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Buti pa ung 0.1.7 working kaso may bug HAHAHA	2026-08-10 06:43:15.372	f
75	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	yow	2026-08-10 06:45:12.294	f
76	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	working na ba to?	2026-08-10 06:45:22.009	f
77	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	di ko knows	2026-08-10 06:45:39.834	f
78	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	Siguro bug pag may double ung user sa account sa chrome. I think need to lagyan ng automatic login pag may user na naka login previously or if statement\n\nif (user===current.userId){\n     redirect(/dashboard);\n}	2026-08-10 06:47:34.683	f
79	TKT-20260809-45C5976AB9	de57d726-3db6-4e26-bdb0-2ebc8f767196	tama kaya ako	2026-08-10 06:48:31.854	f
80	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	di ko rin alam...	2026-08-10 06:49:21.331	f
81	TKT-20260806-39F045D3BE	677e4e23-07a8-40e8-b019-344eb5bf2fca	Ayus na siguro to huhuhu	2026-08-10 06:50:56.874	f
82	TKT-20260806-39F045D3BE	677e4e23-07a8-40e8-b019-344eb5bf2fca	Sending	2026-08-10 06:51:04.029	f
83	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	hilo	2026-08-10 07:01:37.531	f
84	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	oy	2026-08-10 07:01:47.081	f
85	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	naskdasdhajshk	2026-08-10 08:30:28.657	f
86	TKT-20260809-45C5976AB9	8f838b96-0204-4492-8c0a-2c997a34f358	hayup kayooo	2026-08-10 08:45:50.087	f
87	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	HAHAHAH	2026-08-10 08:46:03.434	f
88	TKT-20260809-45C5976AB9	8f838b96-0204-4492-8c0a-2c997a34f358	walang akong net boung week	2026-08-10 08:46:22.818	f
89	TKT-20260809-45C5976AB9	677e4e23-07a8-40e8-b019-344eb5bf2fca	Naku po	2026-08-10 08:46:47.683	f
90	TKT-20260806-39F045D3BE	8f838b96-0204-4492-8c0a-2c997a34f358	hey	2026-08-10 08:49:39.615	f
91	TKT-20260810-0676EDDD15	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello	2026-08-10 08:54:58.886	f
92	TKT-20260810-0676EDDD15	8f838b96-0204-4492-8c0a-2c997a34f358	Hi this is Mica from PLDT! I am Happy to help with your connection concern. This conversation is recorded for quality and assurance purposes. Can you tell me what happen?	2026-08-10 08:56:50.583	f
93	TKT-20260806-39F045D3BE	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello	2026-08-10 08:56:55.281	f
94	TKT-20260810-0676EDDD15	8f838b96-0204-4492-8c0a-2c997a34f358	hello?	2026-08-10 08:58:28.69	f
95	TKT-20260810-0676EDDD15	677e4e23-07a8-40e8-b019-344eb5bf2fca	Wala pa akong internet bakit kaya?	2026-08-10 08:59:19.85	f
96	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	yow	2026-08-10 14:30:59.587	f
97	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	helloo	2026-08-10 14:56:13.298	f
98	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	asdasd	2026-08-10 15:04:20.807	f
99	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	asdasdasd	2026-08-10 15:05:30.998	f
100	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	test1	2026-08-10 15:05:43.967	f
101	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	test2	2026-08-10 15:19:52.288	f
102	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	test 3	2026-08-10 15:20:11.63	f
103	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	asdas	2026-08-10 15:24:41.872	f
104	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello	2026-08-10 15:25:32.089	f
105	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	hi!	2026-08-10 15:30:28.577	f
106	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	asdasdasd	2026-08-10 15:30:41.601	f
107	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	asdasdasd	2026-08-10 15:30:45.917	f
108	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	yow	2026-08-10 15:36:22.798	f
109	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	try natin madami	2026-08-10 15:36:32.043	f
110	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	nagana na?	2026-08-10 15:36:37.066	f
111	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	yes	2026-08-10 15:36:40.951	f
112	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	asdasd	2026-08-10 15:37:01.97	f
113	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	adasdasdasdasdasd	2026-08-10 15:37:05.378	f
114	TKT-20260810-57C26DA1E3	de57d726-3db6-4e26-bdb0-2ebc8f767196	test test test	2026-08-10 15:37:12.296	f
115	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	nagana na nhehehhehe	2026-08-10 15:41:10.634	f
116	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello	2026-08-10 16:03:27.301	f
117	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	yow	2026-08-10 16:15:25.321	f
118	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	send	2026-08-10 18:07:15.959	f
119	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	dsdfsdfds	2026-08-10 18:11:29.153	f
120	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	asdasdasd	2026-08-10 18:12:08.193	f
121	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	tangina	2026-08-11 08:35:04.026	f
122	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	hahaha	2026-08-11 08:35:06.667	f
123	TKT-20260810-57C26DA1E3	677e4e23-07a8-40e8-b019-344eb5bf2fca	asdasd	2026-08-11 09:21:36.934	f
124	TKT-20260810-0676EDDD15	677e4e23-07a8-40e8-b019-344eb5bf2fca	EFSEFSEFSE	2026-08-15 15:44:25.724	f
125	TKT-20260810-F6FA185F1B	677e4e23-07a8-40e8-b019-344eb5bf2fca	hello	2026-08-16 12:01:28.42	f
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tickets (id, title, description, priority, category, status, "userId", "createdAt", "updatedAt", "Assigned_to") FROM stdin;
TKT-20260806-FA69779A37	Hala ung anoo	wla lang HAHAHAH	LOW	GENERAL	OPEN	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-06 11:59:28.035	2026-08-06 11:59:28.035	\N
TKT-20260806-39F045D3BE	Walang Internet dito	Please need ng internet sa bahay di ako makapagchatgpt.	URGENT	OTHER	OPEN	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-06 12:02:55.13	2026-08-08 13:01:41.803	4a5280c8-b745-46f5-8b84-cad04bf60c05
TKT-20260809-45C5976AB9	Conversation Ticket para kay sakalam na si riu	Test natin dito riu	URGENT	OTHER	OPEN	677e4e23-07a8-40e8-b019-344eb5bf2fca	2026-08-09 17:22:26.034	2026-08-09 17:22:26.034	\N
TKT-20260810-0676EDDD15	Panibagong Conversation	Testing 	LOW	GENERAL	OPEN	677e4e23-07a8-40e8-b019-344eb5bf2fca	2026-08-10 08:52:33.056	2026-08-10 08:52:33.056	\N
TKT-20260810-91393E1437	TKT-20260810-0676EDDD15	WLANG INTER KOEIJR	HIGH	GENERAL	OPEN	8f838b96-0204-4492-8c0a-2c997a34f358	2026-08-10 09:13:52.661	2026-08-10 09:13:52.661	\N
TKT-20260810-57C26DA1E3	SIRE YUNG IACOND HIND GUMUGANA	1WEEK NA	URGENT	BUG	PENDING	8f838b96-0204-4492-8c0a-2c997a34f358	2026-08-10 09:36:17.568	2026-08-18 09:41:24.814	4a5280c8-b745-46f5-8b84-cad04bf60c05
TKT-20260810-F6FA185F1B	Issue about internet service	Floor 3rd	URGENT	OTHER	PENDING	67f0138c-3cc3-4790-b467-6efdaeda77cb	2026-08-10 09:21:09.965	2026-09-08 08:38:22.829	4a5280c8-b745-46f5-8b84-cad04bf60c05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, password, name, role, "createdAt", "updatedAt") FROM stdin;
de57d726-3db6-4e26-bdb0-2ebc8f767196	admin@ticketingsystem.com	$2b$10$U8l6G6TZ1kL1Th7p9UFQh.VcpD84jG19MW/u5ViomLOdcWAveN/xO	System Administrator	ADMIN	2026-07-07 07:22:17.76	2026-07-07 07:22:17.76
67f0138c-3cc3-4790-b467-6efdaeda77cb	user1@ticketingsystem.com	$2b$10$P534m8SJjEFT486txeATsOR.FO1JmiHV8RRLfrgYkQ1lkMGr0GJae	User Number 1	USER	2026-07-07 07:23:48.067	2026-07-07 07:23:48.067
4a5280c8-b745-46f5-8b84-cad04bf60c05	agent1@ticketingsystem.com	$2b$10$vvsbwDgg.B5eT4BJJ7GSEeJlxSu.zysJMDWZTb1L46wRapENQ54nC	Agent Number 1	AGENT	2026-07-07 07:25:29.661	2026-07-07 07:25:29.661
e55f710d-0da0-4fb5-9705-efd600c1ef90	agent2@ticketingsystem.com	$2b$10$S96gPY/yaKK6jCTtkVJR2uvKEoG7qaSUM5mzR4sQxtyxS4uPt5j3K	Agent Number 2	AGENT	2026-07-07 07:30:13.409	2026-07-07 07:30:13.409
677e4e23-07a8-40e8-b019-344eb5bf2fca	lorenz@admin	$2b$10$Ub70arRMAepmHBOtmbPqieMdyptwEMauvh8cTgxSQtsWQrHH/.3uy	Jhon Lorenz Bacon	ADMIN	2026-08-09 06:16:32.741	2026-08-09 06:16:32.741
5370b286-4007-43f4-9f60-a06a1087456f	josephestrada@ticketingsystem.com	$2b$10$Ae/4OgeEkPMcqksoh94p4etyYmiBFQ9TjEr9ZVkRic3aNTLnLoP5y	Joseph Estrada	USER	2026-08-09 17:19:10.073	2026-08-09 17:19:10.073
8f838b96-0204-4492-8c0a-2c997a34f358	micaellacubacub@tester	$2b$10$tWjCH4VTd18lb2sESTFrMe4m5NeVF./9eGE1Gnig/DDysUBV2l7vi	Micaella Cubacub	AGENT	2026-08-10 08:43:43.72	2026-08-10 08:43:43.72
\.


--
-- Name: conversation_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.conversation_participants_id_seq', 4, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.messages_id_seq', 125, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_slug_key UNIQUE (slug);


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_endpoint_id_key UNIQUE (endpoint_id);


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: conversation_participants conversation_participants_conversation_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_key UNIQUE (conversation_id);


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversation_participants conversation_participants_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_user_id_key UNIQUE (user_id);


--
-- Name: conversation conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT conversation_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX "account_userId_idx" ON neon_auth.account USING btree ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX invitation_email_idx ON neon_auth.invitation USING btree (email);


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX "invitation_organizationId_idx" ON neon_auth.invitation USING btree ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX "member_organizationId_idx" ON neon_auth.member USING btree ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX "member_userId_idx" ON neon_auth.member USING btree ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE UNIQUE INDEX organization_slug_uidx ON neon_auth.organization USING btree (slug);


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX "session_userId_idx" ON neon_auth.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: neon_auth
--

CREATE INDEX verification_identifier_idx ON neon_auth.verification USING btree (identifier);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: neon_auth
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: messages conversationMessages_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "conversationMessages_fkey" FOREIGN KEY (conversation_id) REFERENCES public.conversation(id) ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversation(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_Assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_Assigned_to_fkey" FOREIGN KEY ("Assigned_to") REFERENCES public.users(id) ON DELETE SET NULL NOT VALID;


--
-- Name: tickets tickets_assigned_to; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_to FOREIGN KEY ("Assigned_to") REFERENCES public.users(id);


--
-- Name: tickets tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages users_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT users_sender_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;


--
-- Name: conversation_participants usersid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT usersid_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict SESz7sH0J9ZeQgfsH2W4vuwukIeelIk4lGirhIRNqddqUJ15auAJC59PL7QpoX1

