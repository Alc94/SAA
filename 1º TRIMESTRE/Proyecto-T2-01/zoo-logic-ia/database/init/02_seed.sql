-- Zoo-Logic IA - datos de ejemplo (sinteticos, solo para demostracion)

INSERT INTO species (common_name, scientific_name, conservation_status, habitat, diet, educational_fact) VALUES
('León africano',      'Panthera leo',            'VU', 'Sabanas y praderas del África subsahariana', 'Carnívoro: cebras, ñus y antílopes', 'Los leones son los únicos felinos que viven en grupos sociales, llamados manadas.'),
('Elefante asiático',  'Elephas maximus',         'EN', 'Bosques tropicales y praderas del sur y sureste de Asia', 'Herbívoro: hierbas, cortezas, raíces y frutas', 'Un elefante asiático puede pasar hasta 16 horas al día buscando y comiendo alimento.'),
('Orangután de Borneo','Pongo pygmaeus',          'CR', 'Selvas tropicales de la isla de Borneo', 'Frugívoro: frutas, hojas, flores y cortezas', 'Los orangutanes construyen un nido nuevo cada noche con ramas y hojas.'),
('Lobo ibérico',       'Canis lupus signatus',    'NT', 'Bosques, matorrales y montañas del noroeste de la península ibérica', 'Carnívoro: ungulados salvajes, conejos y carroña', 'El lobo ibérico es una subespecie propia de la península y cumple un papel clave regulando las poblaciones de herbívoros.'),
('Lince ibérico',      'Lynx pardinus',           'VU', 'Monte mediterráneo y dehesas del sur de la península ibérica', 'Carnívoro: casi exclusivamente conejo de monte', 'El lince ibérico fue el felino más amenazado del mundo y hoy se recupera gracias a programas de cría y reintroducción.'),
('Flamenco común',     'Phoenicopterus roseus',   'LC', 'Lagunas salinas, marismas y estuarios', 'Filtrador: algas, crustáceos y pequeños invertebrados', 'El color rosado de su plumaje proviene de los pigmentos de los crustáceos y algas que comen.')
ON CONFLICT (common_name) DO NOTHING;

INSERT INTO animals (name, tag_code, species_id, sex, birth_date, weight_kg, enclosure, health_status, notes) VALUES
('Simba',    'LEO-0001', (SELECT id FROM species WHERE common_name='León africano'),       'Macho',  '2016-03-14', 188.50, 'Sabana Norte',          'Saludable',      'Macho dominante de la manada. Sin incidencias.'),
('Nala',     'LEO-0002', (SELECT id FROM species WHERE common_name='León africano'),       'Hembra', '2017-06-02', 126.00, 'Sabana Norte',          'Saludable',      NULL),
('Dumbo',    'ELE-0001', (SELECT id FROM species WHERE common_name='Elefante asiático'),   'Hembra', '2005-09-21', 3400.00,'Recinto Paquidermos',  'En observación', 'Cojera leve en la pata trasera izquierda detectada por visión computacional.'),
('Kinabalu', 'ORA-0001', (SELECT id FROM species WHERE common_name='Orangután de Borneo'), 'Macho',  '2012-01-30', 82.40,  'Selva Tropical',        'Saludable',      NULL),
('Sombra',   'LOB-0001', (SELECT id FROM species WHERE common_name='Lobo ibérico'),        'Hembra', '2019-04-11', 34.20,  'Bosque Ibérico',      'Saludable',      NULL),
('Jara',     'LIN-0001', (SELECT id FROM species WHERE common_name='Lince ibérico'),       'Hembra', '2020-02-19', 11.80,  'Dehesa Mediterránea', 'Crítico',        'Pérdida de apetito sostenida. En tratamiento y con monitorización continua.'),
('Rosa',     'FLA-0001', (SELECT id FROM species WHERE common_name='Flamenco común'),      'Hembra', '2018-07-07', 3.10,   'Laguna Rosa',         'Saludable',      NULL),
('Lucero',   'FLA-0002', (SELECT id FROM species WHERE common_name='Flamenco común'),      'Macho',  '2017-05-23', 3.45,   'Laguna Rosa',         'Saludable',      NULL)
ON CONFLICT (tag_code) DO NOTHING;

INSERT INTO vet_records (animal_id, record_date, record_type, description, temperature_c, heart_rate_bpm, source, anomaly_score, veterinarian, validated_by_expert) VALUES
((SELECT id FROM animals WHERE tag_code='LEO-0001'), now() - interval '20 days', 'Revisión',     'Revisión anual. Peso y dentición correctos.', 38.6, 62, 'Veterinario', 0.05, 'Dra. Marta Ruiz', TRUE),
((SELECT id FROM animals WHERE tag_code='ELE-0001'), now() - interval '6 hours', 'Alerta IA',    'La visión computacional detecta asimetría al caminar: menor apoyo en la pata trasera izquierda.', NULL, NULL, 'Visión', 0.78, 'Sistema Zoo-Logic IA', FALSE),
((SELECT id FROM animals WHERE tag_code='ELE-0001'), now() - interval '2 hours', 'Revisión',     'Exploración clínica de la pata. Sin heridas visibles; se programa radiografía.', 36.4, 32, 'Veterinario', 0.40, 'Dr. Luis Herrero', FALSE),
((SELECT id FROM animals WHERE tag_code='LIN-0001'), now() - interval '5 days',  'Tratamiento',  'Inicio de tratamiento antiparasitario y dieta de apoyo.', 38.9, 120, 'Veterinario', 0.55, 'Dra. Marta Ruiz', TRUE),
((SELECT id FROM animals WHERE tag_code='LIN-0001'), now() - interval '1 days',  'Alerta IA',    'El comedero inteligente registra una ingesta un 60 % inferior a la media de las últimas dos semanas.', NULL, NULL, 'IoT', 0.86, 'Sistema Zoo-Logic IA', FALSE),
((SELECT id FROM animals WHERE tag_code='ORA-0001'), now() - interval '12 days', 'Vacunación',   'Refuerzo de vacuna anual administrado sin complicaciones.', 36.9, 78, 'Veterinario', 0.02, 'Dr. Luis Herrero', TRUE),
((SELECT id FROM animals WHERE tag_code='LOB-0001'), now() - interval '3 days',  'Revisión',     'Sensor de collar: actividad nocturna dentro del rango esperado.', 38.2, 90, 'IoT', 0.10, 'Dra. Marta Ruiz', TRUE),
((SELECT id FROM animals WHERE tag_code='FLA-0001'), now() - interval '9 days',  'Revisión',     'Plumaje y patas en buen estado. Comportamiento social normal.', 40.5, 160, 'Veterinario', 0.03, 'Dra. Marta Ruiz', TRUE);
