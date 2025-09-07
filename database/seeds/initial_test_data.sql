-- ============================================
-- INITIAL TEST DATA FOR SURPASS SYSTEM
-- Run this after test_system.sql schema
-- ============================================

-- Sample TEF Reading Practice Set
INSERT INTO skill_practice_sets (test_type_id, skill_id, title, description, difficulty, estimated_duration, topics) VALUES
(2, 1, 'TEF Test 1: Société et Environnement', 'Compréhension écrite sur les sujets sociétaux et environnementaux', 'intermediate', 60, ARRAY['Société', 'Environnement', 'Urbanisme']);

-- TEF Reading Content
INSERT INTO skill_practice_content (practice_set_id, section_number, title, content_type, content_text, instructions) VALUES
(1, 1, 'Les jardins verticaux en ville', 'text', 
'Les jardins verticaux, aussi appelés murs végétalisés, représentent une innovation majeure dans l''aménagement urbain moderne. Ces structures permettent de cultiver des plantes sur les façades des bâtiments, transformant ainsi l''environnement urbain en espaces plus verts et plus respirables.

L''idée n''est pas nouvelle : les jardins suspendus de Babylone en sont un exemple historique. Cependant, les techniques contemporaines ont révolutionné cette approche. Les systèmes d''irrigation automatisés, les substrats légers et les espèces végétales sélectionnées permettent aujourd''hui de créer des installations durables et esthétiques.

Les avantages sont multiples. D''abord, ces jardins contribuent à l''amélioration de la qualité de l''air en absorbant le dioxyde de carbone et en produisant de l''oxygène. Ensuite, ils participent à la régulation thermique des bâtiments, réduisant ainsi les coûts énergétiques. Enfin, ils offrent un habitat précieux pour la biodiversité urbaine, notamment les oiseaux et les insectes pollinisateurs.

Cependant, quelques défis subsistent. L''entretien régulier est indispensable, ce qui représente un coût non négligeable. De plus, le choix des espèces doit être adapté au climat local et aux conditions d''exposition. Malgré ces contraintes, de nombreuses villes comme Paris, Milan ou Singapour ont intégré ces solutions dans leur planification urbaine.',

'Lisez le texte suivant et répondez aux questions.');

-- TEF Reading Questions
INSERT INTO skill_practice_questions (content_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
(1, 1, 'multiple-choice', 'Selon le texte, les jardins verticaux modernes se distinguent des jardins historiques par :', 
'["Les techniques contemporaines", "Leur localisation urbaine", "Leur fonction décorative", "Leur taille plus importante"]', 
'Les techniques contemporaines', 
'Le texte précise que "les techniques contemporaines ont révolutionné cette approche"', 1),

(1, 2, 'multiple-choice', 'Un des avantages mentionnés des jardins verticaux est :', 
'["L''augmentation du prix de l''immobilier", "La régulation thermique des bâtiments", "La réduction du bruit urbain", "L''amélioration de l''éclairage naturel"]', 
'La régulation thermique des bâtiments', 
'Le texte indique qu''ils "participent à la régulation thermique des bâtiments"', 1);

-- Sample TEF Writing Practice Set
INSERT INTO skill_practice_sets (test_type_id, skill_id, title, description, difficulty, estimated_duration, topics) VALUES
(2, 2, 'TEF Expression écrite - Messages et argumentation', 'Pratique des deux sections de l''expression écrite TEF', 'intermediate', 60, ARRAY['Communication professionnelle', 'Argumentation', 'Société']);

-- TEF Writing Section A Content
INSERT INTO skill_practice_content (practice_set_id, section_number, title, content_type, content_text, instructions) VALUES
(2, 1, 'Section A - Message professionnel', 'prompt', 
'Vous travaillez dans une entreprise de marketing. Votre collègue Marie vous a envoyé par erreur un document confidentiel destiné à un autre service. Écrivez-lui un courriel pour l''informer de cette erreur tout en restant poli et professionnel.',
'Consignes :
• Informez Marie de l''erreur
• Mentionnez que vous n''avez pas consulté le document  
• Suggérez une solution
• Gardez un ton professionnel

Nombre de mots requis : 60 à 120 mots
Temps alloué : 15 minutes');

-- Sample IELTS Reading Practice Set
INSERT INTO skill_practice_sets (test_type_id, skill_id, title, description, difficulty, estimated_duration, topics) VALUES
(1, 1, 'IELTS Academic Reading Test 1', 'Complete academic reading test with 3 passages', 'intermediate', 60, ARRAY['Science', 'Society', 'Environment']);

-- IELTS Reading Passage 1
INSERT INTO skill_practice_content (practice_set_id, section_number, title, content_type, content_text, instructions, word_count) VALUES
(3, 1, 'The History of Renewable Energy', 'text',
'The quest for renewable energy sources is not a modern phenomenon. Throughout history, humans have harnessed natural forces to meet their energy needs. Wind power, for instance, has been utilized for over a millennium. The earliest windmills appeared in Persia around 900 AD, primarily used for grinding grain and pumping water.

Solar energy, too, has ancient roots. The Greeks and Romans positioned their homes to capture winter sun while avoiding summer heat, a practice known as passive solar design. However, the first practical solar cell wasn''t developed until 1954 by Bell Laboratories, marking the beginning of modern photovoltaic technology.

The industrial revolution accelerated the search for alternative energy sources. As coal became the dominant fuel, concerns about air pollution and resource depletion emerged. The oil crises of the 1970s further highlighted the vulnerability of fossil fuel dependence, spurring government investment in renewable technologies.

Today, renewable energy represents the fastest-growing sector in global electricity generation. Wind and solar costs have plummeted, making them competitive with traditional fossil fuels in many regions. This transformation reflects decades of technological advancement, supportive policies, and growing environmental awareness.',

'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
295);

-- IELTS Reading Questions for Passage 1
INSERT INTO skill_practice_questions (content_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES
(4, 1, 'multiple-choice', 'The earliest windmills were primarily used for:', 
'["generating electricity", "grinding grain and pumping water", "heating homes", "transportation"]',
'grinding grain and pumping water',
'The text states "primarily used for grinding grain and pumping water"', 1),

(4, 2, 'true-false', 'The first solar cell was developed in the 19th century.', 
'["True", "False", "Not Given"]',
'False',
'The text states the first practical solar cell was developed in 1954', 1),

(4, 3, 'fill-blank', 'The _______ of the 1970s highlighted the vulnerability of fossil fuel dependence.', 
'[]',
'oil crises',
'The text mentions "The oil crises of the 1970s"', 1);

-- Sample Mock Test
INSERT INTO mock_tests (test_type_id, version, title, description, total_duration, total_questions, difficulty) VALUES
(1, 'Practice Test 1', 'IELTS Academic Practice Test 1', 'Complete IELTS Academic test simulation', 165, 40, 'intermediate');

-- Mock Test Sections
INSERT INTO mock_test_sections (mock_test_id, skill_id, section_number, title, instructions, duration, total_questions) VALUES
(1, 1, 1, 'Reading Section', 'You have 60 minutes to complete all three reading passages', 60, 40),
(1, 2, 2, 'Writing Section', 'You have 60 minutes to complete both writing tasks', 60, 2),
(1, 3, 3, 'Listening Section', 'You have 30 minutes to complete all four listening sections', 30, 40),
(1, 4, 4, 'Speaking Section', 'You have 11-14 minutes for the speaking test', 15, 3);