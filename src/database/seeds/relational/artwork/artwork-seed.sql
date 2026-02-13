-- Artwork Seed Data
-- This script inserts 5 sample artworks into the database
-- Prerequisites: You must have at least one company, tenant, and user in the database

-- Insert 5 famous artworks
-- Note: Replace the UUIDs for companyId, tenantId, and createdById with actual values from your database

INSERT INTO
    artwork (
        id,
        title,
        artist,
        year,
        medium,
        dimensions,
        price,
        "imageUrl",
        "companyId",
        "tenantId",
        "createdById",
        "createdAt",
        "updatedAt"
    )
SELECT
    uuid_generate_v4 (),
    'Starry Night',
    'Vincent van Gogh',
    1889,
    'Oil on canvas',
    '73.7 cm × 92.1 cm',
    100000000,
    'https://example.com/starry-night.jpg',
    (
        SELECT id
        FROM company
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM tenant
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM "user"
        ORDER BY "createdAt"
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM artwork
        WHERE
            title = 'Starry Night'
    );

INSERT INTO
    artwork (
        id,
        title,
        artist,
        year,
        medium,
        dimensions,
        price,
        "imageUrl",
        "companyId",
        "tenantId",
        "createdById",
        "createdAt",
        "updatedAt"
    )
SELECT
    uuid_generate_v4 (),
    'The Persistence of Memory',
    'Salvador Dalí',
    1931,
    'Oil on canvas',
    '24 cm × 33 cm',
    50000000,
    'https://example.com/persistence-of-memory.jpg',
    (
        SELECT id
        FROM company
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM tenant
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM "user"
        ORDER BY "createdAt"
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM artwork
        WHERE
            title = 'The Persistence of Memory'
    );

INSERT INTO
    artwork (
        id,
        title,
        artist,
        year,
        medium,
        dimensions,
        price,
        "imageUrl",
        "companyId",
        "tenantId",
        "createdById",
        "createdAt",
        "updatedAt"
    )
SELECT
    uuid_generate_v4 (),
    'The Scream',
    'Edvard Munch',
    1893,
    'Oil, tempera, pastel and crayon on cardboard',
    '91 cm × 73.5 cm',
    119900000,
    'https://example.com/the-scream.jpg',
    (
        SELECT id
        FROM company
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM tenant
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM "user"
        ORDER BY "createdAt"
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM artwork
        WHERE
            title = 'The Scream'
    );

INSERT INTO
    artwork (
        id,
        title,
        artist,
        year,
        medium,
        dimensions,
        price,
        "imageUrl",
        "companyId",
        "tenantId",
        "createdById",
        "createdAt",
        "updatedAt"
    )
SELECT
    uuid_generate_v4 (),
    'Girl with a Pearl Earring',
    'Johannes Vermeer',
    1665,
    'Oil on canvas',
    '44.5 cm × 39 cm',
    75000000,
    'https://example.com/girl-with-pearl-earring.jpg',
    (
        SELECT id
        FROM company
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM tenant
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM "user"
        ORDER BY "createdAt"
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM artwork
        WHERE
            title = 'Girl with a Pearl Earring'
    );

INSERT INTO
    artwork (
        id,
        title,
        artist,
        year,
        medium,
        dimensions,
        price,
        "imageUrl",
        "companyId",
        "tenantId",
        "createdById",
        "createdAt",
        "updatedAt"
    )
SELECT
    uuid_generate_v4 (),
    'The Great Wave off Kanagawa',
    'Katsushika Hokusai',
    1831,
    'Woodblock print',
    '25.7 cm × 37.8 cm',
    2500000,
    'https://example.com/great-wave.jpg',
    (
        SELECT id
        FROM company
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM tenant
        ORDER BY "createdAt"
        LIMIT 1
    ),
    (
        SELECT id
        FROM "user"
        ORDER BY "createdAt"
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM artwork
        WHERE
            title = 'The Great Wave off Kanagawa'
    );

-- Verify the inserts
SELECT COUNT(*) as artwork_count FROM artwork;