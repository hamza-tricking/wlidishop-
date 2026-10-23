// Demo catalog for the kids toys store. Images live in uploads/seed-*.jpg (committed with the repo).
const categories = [
  {
    slug: 'plush-toys',
    order: 1,
    image: 'seed-cat-plush-toys.jpg',
    name: { ar: 'الدمى المحشوة', en: 'Plush Toys', fr: 'Peluches' },
    description: { ar: 'دببة وأرانب ناعمة لأحضان دافئة', en: 'Soft bears and bunnies for warm hugs', fr: 'Ours et lapins tout doux pour des câlins' },
  },
  {
    slug: 'building-blocks',
    order: 2,
    image: 'seed-cat-building-blocks.jpg',
    name: { ar: 'ألعاب البناء', en: 'Building Blocks', fr: 'Jeux de construction' },
    description: { ar: 'مكعبات وقطع تركيب تنمي الخيال', en: 'Bricks and blocks that grow imagination', fr: 'Briques et cubes pour développer l’imagination' },
  },
  {
    slug: 'educational',
    order: 3,
    image: 'seed-cat-educational.jpg',
    name: { ar: 'ألعاب تعليمية', en: 'Educational Toys', fr: 'Jouets éducatifs' },
    description: { ar: 'ألغاز وألعاب ذكاء للتعلم باللعب', en: 'Puzzles and brain games to learn through play', fr: 'Puzzles et jeux d’éveil pour apprendre en jouant' },
  },
  {
    slug: 'outdoor',
    order: 4,
    image: 'seed-cat-outdoor.jpg',
    name: { ar: 'ألعاب خارجية', en: 'Outdoor & Ride-on', fr: 'Plein air & Porteurs' },
    description: { ar: 'دراجات وسكوترات للحركة والنشاط', en: 'Bikes and scooters for active kids', fr: 'Vélos et trottinettes pour enfants actifs' },
  },
  {
    slug: 'baby',
    order: 5,
    image: 'seed-cat-baby.jpg',
    name: { ar: 'مستلزمات الرضع', en: 'Baby Essentials', fr: 'Essentiels bébé' },
    description: { ar: 'كل ما يحتاجه طفلك الصغير', en: 'Everything your little one needs', fr: 'Tout ce dont votre bébé a besoin' },
  },
  {
    slug: 'vehicles',
    order: 6,
    image: 'seed-cat-vehicles.jpg',
    name: { ar: 'سيارات وقطارات', en: 'Cars & Trains', fr: 'Voitures & Trains' },
    description: { ar: 'سيارات وقطارات ومركبات للمغامرات', en: 'Cars, trains and vehicles for adventures', fr: 'Voitures, trains et véhicules pour l’aventure' },
  },
];

const d = (ar, en, fr) => ({ ar, en, fr });

const products = [
  {
    slug: 'classic-teddy-bear',
    category: 'plush-toys',
    sku: 'PL-001',
    price: 2500,
    oldPrice: 3200,
    stock: 40,
    rating: 4.8,
    featured: true,
    images: ['seed-classic-teddy-bear-1.jpg', 'seed-classic-teddy-bear-2.jpg'],
    name: d('دبدوب كلاسيكي ناعم', 'Classic Soft Teddy Bear', 'Ours en peluche classique'),
    description: d(
      'دبدوب ناعم جداً بحشوة آمنة وخياطة متينة.\n• قماش مضاد للحساسية\n• مناسب من عمر 0 سنوات\n• قابل للغسل في الغسالة',
      'An ultra-soft teddy with safe filling and strong stitching.\n• Hypoallergenic fabric\n• Suitable from birth\n• Machine washable',
      'Un ours ultra doux avec un rembourrage sûr et des coutures solides.\n• Tissu hypoallergénique\n• Dès la naissance\n• Lavable en machine'
    ),
  },
  {
    slug: 'plush-bunny',
    category: 'plush-toys',
    sku: 'PL-002',
    price: 1800,
    oldPrice: 0,
    stock: 35,
    rating: 4.6,
    images: ['seed-plush-bunny-1.jpg', 'seed-plush-bunny-2.jpg'],
    name: d('أرنب محشو بآذان طويلة', 'Long-Ear Plush Bunny', 'Lapin en peluche grandes oreilles'),
    description: d(
      'رفيق النوم المثالي لطفلك، خفيف وناعم.\n• طول 35 سم\n• عيون مطرزة آمنة\n• هدية رائعة للمواليد',
      'The perfect bedtime buddy, light and cuddly.\n• 35 cm tall\n• Safe embroidered eyes\n• A lovely newborn gift',
      'Le compagnon de dodo idéal, léger et câlin.\n• 35 cm de haut\n• Yeux brodés sécurisés\n• Superbe cadeau de naissance'
    ),
  },
  {
    slug: 'plush-animals-set',
    category: 'plush-toys',
    sku: 'PL-003',
    price: 3400,
    oldPrice: 4000,
    stock: 18,
    rating: 4.5,
    images: ['seed-plush-animals-set-1.jpg', 'seed-plush-animals-set-2.jpg'],
    name: d('مجموعة حيوانات محشوة', 'Stuffed Animals Collection', 'Collection d’animaux en peluche'),
    description: d(
      'مجموعة من الحيوانات المحشوة الملونة لعالم مليء بالقصص.\n• 4 قطع\n• ألوان زاهية\n• حجم مناسب لليد الصغيرة',
      'A colorful set of stuffed animals for a world full of stories.\n• 4 pieces\n• Bright colors\n• Sized for little hands',
      'Un ensemble coloré d’animaux en peluche pour mille histoires.\n• 4 pièces\n• Couleurs vives\n• Adapté aux petites mains'
    ),
  },
  {
    slug: 'building-bricks-set',
    category: 'building-blocks',
    sku: 'BB-001',
    price: 4200,
    oldPrice: 5000,
    stock: 25,
    rating: 4.9,
    featured: true,
    images: ['seed-building-bricks-set-1.jpg', 'seed-building-bricks-set-2.jpg'],
    name: d('مجموعة مكعبات بناء ملونة', 'Colorful Building Bricks Set', 'Coffret de briques de construction'),
    description: d(
      'أكثر من 500 قطعة لبناء البيوت والسيارات والقلاع.\n• متوافقة مع العلامات الشهيرة\n• بلاستيك ABS آمن\n• تنمي التركيز والإبداع',
      'Over 500 pieces to build houses, cars and castles.\n• Compatible with major brands\n• Safe ABS plastic\n• Builds focus and creativity',
      'Plus de 500 pièces pour construire maisons, voitures et châteaux.\n• Compatible avec les grandes marques\n• Plastique ABS sûr\n• Stimule la concentration et la créativité'
    ),
  },
  {
    slug: 'wooden-blocks',
    category: 'building-blocks',
    sku: 'BB-002',
    price: 2900,
    oldPrice: 0,
    stock: 30,
    rating: 4.7,
    images: ['seed-wooden-blocks-1.jpg', 'seed-wooden-blocks-2.jpg'],
    name: d('مكعبات خشبية طبيعية', 'Natural Wooden Blocks', 'Cubes en bois naturel'),
    description: d(
      'مكعبات من الخشب الطبيعي بألوان مائية آمنة.\n• 50 قطعة بأشكال مختلفة\n• حواف ناعمة\n• صندوق تخزين',
      'Natural wood blocks with safe water-based paint.\n• 50 pieces in various shapes\n• Smooth edges\n• Storage box included',
      'Cubes en bois naturel peints à l’eau.\n• 50 pièces de formes variées\n• Bords arrondis\n• Boîte de rangement incluse'
    ),
  },
  {
    slug: 'wooden-construction-kit',
    category: 'building-blocks',
    sku: 'BB-003',
    price: 5600,
    oldPrice: 6500,
    stock: 12,
    rating: 4.8,
    images: ['seed-wooden-construction-kit-1.jpg', 'seed-wooden-construction-kit-2.jpg'],
    name: d('ألعاب تركيب خشبية متداخلة', 'Wooden Construction Kit', 'Kit de construction en bois'),
    description: d(
      'قطع تركيب خشبية مع براغي وأدوات آمنة للأطفال.\n• تعلم الهندسة باللعب\n• أكثر من 80 قطعة\n• من عمر 3 سنوات',
      'Wooden construction pieces with kid-safe bolts and tools.\n• Learn engineering through play\n• 80+ pieces\n• Ages 3+',
      'Pièces de construction en bois avec vis et outils adaptés.\n• Apprendre l’ingénierie en jouant\n• Plus de 80 pièces\n• Dès 3 ans'
    ),
  },
  {
    slug: 'wooden-puzzle',
    category: 'educational',
    sku: 'ED-001',
    price: 1600,
    oldPrice: 2000,
    stock: 50,
    rating: 4.6,
    featured: true,
    images: ['seed-wooden-puzzle-1.jpg', 'seed-wooden-puzzle-2.jpg'],
    name: d('لغز خشبي للأطفال', 'Kids Wooden Puzzle', 'Puzzle en bois pour enfants'),
    description: d(
      'لغز تركيب يعلّم الأشكال والألوان ويقوي الذاكرة.\n• قطع كبيرة سهلة المسك\n• ألوان غير سامة\n• من عمر سنتين',
      'A jigsaw that teaches shapes and colors and boosts memory.\n• Large easy-grip pieces\n• Non-toxic colors\n• Ages 2+',
      'Un puzzle qui apprend formes et couleurs et renforce la mémoire.\n• Grandes pièces faciles à saisir\n• Couleurs non toxiques\n• Dès 2 ans'
    ),
  },
  {
    slug: 'abacus-counting-frame',
    category: 'educational',
    sku: 'ED-002',
    price: 1400,
    oldPrice: 0,
    stock: 45,
    rating: 4.4,
    images: ['seed-abacus-counting-frame-1.jpg', 'seed-abacus-counting-frame-2.jpg'],
    name: d('معداد خشبي لتعلم الحساب', 'Wooden Abacus Counting Frame', 'Boulier en bois pour compter'),
    description: d(
      'معداد ملون لتعلم العد والجمع والطرح بطريقة ممتعة.\n• 100 خرزة ملونة\n• إطار خشبي متين\n• مثالي للتحضيري',
      'A colorful abacus to learn counting, adding and subtracting.\n• 100 colored beads\n• Sturdy wooden frame\n• Perfect for preschool',
      'Un boulier coloré pour apprendre à compter, additionner et soustraire.\n• 100 perles colorées\n• Cadre en bois solide\n• Idéal pour la maternelle'
    ),
  },
  {
    slug: 'shape-sorter',
    category: 'educational',
    sku: 'ED-003',
    price: 1900,
    oldPrice: 2300,
    stock: 28,
    rating: 4.5,
    images: ['seed-shape-sorter-1.jpg', 'seed-shape-sorter-2.jpg'],
    name: d('لعبة فرز الأشكال', 'Shape Sorter Toy', 'Jeu de tri des formes'),
    description: d(
      'لعبة كلاسيكية لتطوير المهارات الحركية الدقيقة والتعرف على الأشكال.\n• 12 شكلاً مختلفاً\n• ألوان زاهية\n• من 18 شهراً',
      'A classic toy that develops fine motor skills and shape recognition.\n• 12 different shapes\n• Bright colors\n• 18 months+',
      'Un jouet classique pour la motricité fine et la reconnaissance des formes.\n• 12 formes différentes\n• Couleurs vives\n• Dès 18 mois'
    ),
  },
  {
    slug: 'rubiks-cube',
    category: 'educational',
    sku: 'ED-004',
    price: 900,
    oldPrice: 1200,
    stock: 60,
    rating: 4.7,
    images: ['seed-rubiks-cube-1.jpg', 'seed-rubiks-cube-2.jpg'],
    name: d('مكعب روبيك 3×3', 'Speed Cube 3×3', 'Cube magique 3×3'),
    description: d(
      'مكعب ذكاء سريع الدوران لتحدي العقل والتركيز.\n• دوران سلس\n• ألوان ثابتة لا تبهت\n• للكبار والصغار',
      'A smooth speed cube to challenge the mind and focus.\n• Smooth turning\n• Fade-proof colors\n• For kids and adults',
      'Un cube rapide et fluide pour défier l’esprit.\n• Rotation fluide\n• Couleurs résistantes\n• Pour petits et grands'
    ),
  },
  {
    slug: 'kids-tricycle',
    category: 'outdoor',
    sku: 'OD-001',
    price: 8900,
    oldPrice: 10500,
    stock: 10,
    rating: 4.6,
    featured: true,
    images: ['seed-kids-tricycle-1.jpg', 'seed-kids-tricycle-2.jpg'],
    name: d('دراجة ثلاثية للأطفال', 'Kids Tricycle', 'Tricycle pour enfants'),
    description: d(
      'دراجة ثلاثية متينة مع مقعد مريح ومقبض للأهل.\n• إطار معدني قوي\n• عجلات مانعة للانزلاق\n• من عمر سنتين إلى 5 سنوات',
      'A sturdy tricycle with a comfy seat and parent handle.\n• Strong metal frame\n• Anti-slip wheels\n• Ages 2 to 5',
      'Un tricycle robuste avec siège confortable et canne parentale.\n• Cadre métallique solide\n• Roues antidérapantes\n• De 2 à 5 ans'
    ),
  },
  {
    slug: 'kick-scooter',
    category: 'outdoor',
    sku: 'OD-002',
    price: 6500,
    oldPrice: 0,
    stock: 14,
    rating: 4.5,
    images: ['seed-kick-scooter-1.jpg', 'seed-kick-scooter-2.jpg'],
    name: d('سكوتر أطفال قابل للطي', 'Foldable Kids Scooter', 'Trottinette pliable enfant'),
    description: d(
      'سكوتر خفيف قابل للطي مع مقبض قابل للتعديل.\n• عجلات مضيئة\n• يتحمل حتى 50 كغ\n• فرامل خلفية آمنة',
      'A lightweight foldable scooter with an adjustable handlebar.\n• Light-up wheels\n• Holds up to 50 kg\n• Safe rear brake',
      'Une trottinette légère et pliable au guidon réglable.\n• Roues lumineuses\n• Supporte jusqu’à 50 kg\n• Frein arrière sécurisé'
    ),
  },
  {
    slug: 'rocking-horse',
    category: 'outdoor',
    sku: 'OD-003',
    price: 7200,
    oldPrice: 8000,
    stock: 8,
    rating: 4.9,
    images: ['seed-rocking-horse-1.jpg', 'seed-rocking-horse-2.jpg'],
    name: d('حصان هزاز خشبي', 'Wooden Rocking Horse', 'Cheval à bascule en bois'),
    description: d(
      'حصان هزاز كلاسيكي من الخشب المتين يمنح طفلك ساعات من المرح.\n• مقابض آمنة\n• قاعدة ثابتة\n• من عمر سنة',
      'A classic solid-wood rocking horse for hours of fun.\n• Safe handles\n• Stable base\n• Ages 1+',
      'Un cheval à bascule classique en bois massif pour des heures de jeu.\n• Poignées sécurisées\n• Base stable\n• Dès 1 an'
    ),
  },
  {
    slug: 'baby-rattle-set',
    category: 'baby',
    sku: 'BA-001',
    price: 1200,
    oldPrice: 1500,
    stock: 70,
    rating: 4.7,
    images: ['seed-baby-rattle-set-1.jpg', 'seed-baby-rattle-set-2.jpg'],
    name: d('مجموعة خشخيشات للرضع', 'Baby Rattle Set', 'Lot de hochets pour bébé'),
    description: d(
      'خشخيشات ملونة تحفز السمع والبصر لدى الرضيع.\n• خالية من BPA\n• سهلة الإمساك\n• من عمر 3 أشهر',
      'Colorful rattles that stimulate baby’s hearing and sight.\n• BPA free\n• Easy to grip\n• 3 months+',
      'Des hochets colorés qui stimulent l’ouïe et la vue de bébé.\n• Sans BPA\n• Faciles à saisir\n• Dès 3 mois'
    ),
  },
  {
    slug: 'baby-stroller',
    category: 'baby',
    sku: 'BA-002',
    price: 24000,
    oldPrice: 27000,
    stock: 5,
    rating: 4.8,
    featured: true,
    images: ['seed-baby-stroller-1.jpg', 'seed-baby-stroller-2.jpg'],
    name: d('عربة أطفال مريحة', 'Comfort Baby Stroller', 'Poussette confort'),
    description: d(
      'عربة أطفال خفيفة قابلة للطي بيد واحدة.\n• مظلة واقية من الشمس\n• سلة تخزين كبيرة\n• حزام أمان 5 نقاط',
      'A lightweight stroller that folds with one hand.\n• Sun canopy\n• Large storage basket\n• 5-point safety harness',
      'Une poussette légère pliable d’une seule main.\n• Capote pare-soleil\n• Grand panier de rangement\n• Harnais 5 points'
    ),
  },
  {
    slug: 'toy-race-car',
    category: 'vehicles',
    sku: 'VH-001',
    price: 2200,
    oldPrice: 2800,
    stock: 32,
    rating: 4.5,
    images: ['seed-toy-race-car-1.jpg', 'seed-toy-race-car-2.jpg'],
    name: d('سيارة سباق لعبة', 'Toy Race Car', 'Voiture de course jouet'),
    description: d(
      'سيارة سباق متينة بتفاصيل واقعية وعجلات سريعة.\n• هيكل معدني\n• أبواب تفتح\n• مثالية لهواة السيارات الصغار',
      'A sturdy race car with realistic details and fast wheels.\n• Die-cast body\n• Opening doors\n• Perfect for little car fans',
      'Une voiture de course robuste aux détails réalistes.\n• Carrosserie en métal\n• Portières qui s’ouvrent\n• Parfaite pour les petits passionnés'
    ),
  },
  {
    slug: 'wooden-train-set',
    category: 'vehicles',
    sku: 'VH-002',
    price: 4800,
    oldPrice: 5500,
    stock: 16,
    rating: 4.9,
    featured: true,
    images: ['seed-wooden-train-set-1.jpg', 'seed-wooden-train-set-2.jpg'],
    name: d('قطار خشبي مع سكة', 'Wooden Train Set', 'Train en bois avec rails'),
    description: d(
      'قطار خشبي مع عربات وسكة قابلة للتركيب بأشكال متعددة.\n• 40 قطعة\n• عربات مغناطيسية\n• من عمر 3 سنوات',
      'A wooden train with wagons and a track you can build many ways.\n• 40 pieces\n• Magnetic wagons\n• Ages 3+',
      'Un train en bois avec wagons et rails modulables.\n• 40 pièces\n• Wagons magnétiques\n• Dès 3 ans'
    ),
  },
  {
    slug: 'toy-truck',
    category: 'vehicles',
    sku: 'VH-003',
    price: 3100,
    oldPrice: 0,
    stock: 20,
    rating: 4.4,
    images: ['seed-toy-truck-1.jpg', 'seed-toy-truck-2.jpg'],
    name: d('شاحنة ألعاب كبيرة', 'Big Toy Truck', 'Grand camion jouet'),
    description: d(
      'شاحنة ألعاب قوية بصندوق قلاب للعب في الرمل والحديقة.\n• بلاستيك مقاوم للصدمات\n• عجلات كبيرة\n• للداخل والخارج',
      'A tough toy truck with a tipping bed for sand and garden play.\n• Impact-resistant plastic\n• Big wheels\n• Indoor and outdoor',
      'Un camion solide à benne basculante pour le sable et le jardin.\n• Plastique résistant aux chocs\n• Grandes roues\n• Intérieur et extérieur'
    ),
  },
];

const settings = {
  storeName: { ar: 'وليدي شوب', en: 'Wlidi Shop', fr: 'Wlidi Shop' },
  logo: 'seed-logo.png',
  topbar: {
    ar: 'مرحبا بكم في متجر وليدي شوب — الدفع عند الاستلام في 58 ولاية',
    en: 'Welcome to Wlidi Shop — cash on delivery in all 58 wilayas',
    fr: 'Bienvenue chez Wlidi Shop — paiement à la livraison dans les 58 wilayas',
  },
  heroTitle: { ar: 'متجر خاص بألعاب طفلك', en: 'The toy store made for your child', fr: 'La boutique de jouets pour votre enfant' },
  heroSubtitle: {
    ar: 'لأن طفلك كنز فهو يستحق الأفضل',
    en: 'Because your child is a treasure, they deserve the best',
    fr: 'Parce que votre enfant est un trésor, il mérite le meilleur',
  },
  footerAbout: {
    ar: 'ألعاب آمنة ومختارة بعناية لكل الأعمار، مع توصيل سريع والدفع عند الاستلام.',
    en: 'Safe, carefully selected toys for every age, with fast delivery and cash on delivery.',
    fr: 'Des jouets sûrs et soigneusement choisis pour tous les âges, livraison rapide et paiement à la livraison.',
  },
  footerCopyright: { ar: 'جميع الحقوق محفوظة لـ وليدي شوب', en: 'All rights reserved — Wlidi Shop', fr: 'Tous droits réservés — Wlidi Shop' },
  thankYou: {
    ar: 'شكراً لثقتك! سيتصل بك فريقنا قريباً لتأكيد الطلب، يرجى إبقاء الهاتف مفتوحاً.',
    en: 'Thank you for your trust! Our team will call you soon to confirm your order, please keep your phone on.',
    fr: 'Merci pour votre confiance ! Notre équipe vous appellera bientôt pour confirmer la commande, gardez votre téléphone allumé.',
  },
  policies: {
    ar: 'الدفع عند الاستلام: لا ندفع أي مبلغ مسبقاً.\nالتوصيل خلال 2 إلى 7 أيام حسب الولاية.\nضمان الاستبدال إذا وصل المنتج معطوباً.',
    en: 'Cash on delivery: nothing to pay in advance.\nDelivery within 2 to 7 days depending on the wilaya.\nFree exchange if the product arrives damaged.',
    fr: 'Paiement à la livraison : rien à payer d’avance.\nLivraison sous 2 à 7 jours selon la wilaya.\nÉchange garanti si le produit arrive endommagé.',
  },
  currency: { ar: 'دج', en: 'DA', fr: 'DA' },
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    whatsapp: '213555000000',
    phone: '0555 00 00 00',
    email: 'contact@wlidishop.dz',
  },
};

module.exports = { categories, products, settings };
