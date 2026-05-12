import csv, random, os

random.seed(42)

PROVINCES_DISTRICTS_SECTORS = {
    "Kigali City": {
        "Gasabo": ["Kacyiru", "Kimironko", "Remera", "Nyarutarama", "Gacuriro", "Kimihurura", "Gisozi", "Kinyinya", "Nduba", "Rusororo", "Bumbogo", "Jabana", "Kagarama"],
        "Kicukiro": ["Gikondo", "Kicukiro", "Kanombe", "Kagarama", "Niboye", "Gahanga", "Gatenga", "Masaka", "Nyarugunga"],
        "Nyarugenge": ["Nyamirambo", "Kiyovu", "Kigali", "Muhima", "Nyarugenge", "Gitega", "Kanyinya", "Kimisagara", "Mageragere"],
    },
    "Northern Province": {
        "Musanze": ["Ruhengeri", "Busogo", "Cyuve", "Gacaca", "Gashaki", "Gataraga", "Kimonyi", "Kinigi", "Muhoza", "Muko", "Nkotsi", "Nyange", "Remera", "Rwaza", "Shingiro"],
        "Burera": ["Burera", "Bungwe", "Butaro", "Cyanika", "Cyeru", "Gahunga", "Gatebe", "Gitovu", "Kagogo", "Kinoni", "Kinyababa", "Kivuye", "Nemba", "Rugarama", "Rugengabari", "Ruhunde", "Rusarabuye"],
        "Gicumbi": ["Byumba", "Bukure", "Bwisige", "Cyumba", "Giti", "Kageyo", "Kaniga", "Manyagiro", "Miyove", "Mukarange", "Muko", "Mutete", "Nyamiyaga", "Nyankenke", "Rubaya", "Rukomo", "Rushaki", "Rutare"],
        "Rulindo": ["Tumba", "Burega", "Bushoki", "Buyoga", "Cyinzuzi", "Cyungo", "Kisaro", "Masoro", "Mbogo", "Murambi", "Ngoma", "Ntarabana", "Rukozo", "Rusiga", "Shyorongi"],
        "Gakenke": ["Gakenke", "Busengo", "Coko", "Cyabingo", "Gashenyi", "Mugunga", "Kamubuga", "Karambo", "Kivuruga", "Mataba", "Minazi", "Muhondo", "Muyongwe", "Muzo", "Nemba", "Ruli", "Rusasa", "Rushashi"],
    },
    "Southern Province": {
        "Huye": ["Butare", "Gishamvu", "Huye", "Karama", "Kigoma", "Kinazi", "Maraba", "Mbazi", "Mukura", "Ngoma", "Ruhashya", "Rusatira", "Rwaniro", "Simbi", "Tumba"],
        "Nyanza": ["Nyanza", "Busasamana", "Kibirizi", "Kigoma", "Mukingo", "Muyira", "Nyagisozi", "Rwabicuma"],
        "Gisagara": ["Kansi", "Kibilizi", "Kigembe", "Mamba", "Muganza", "Mugombwa", "Mukindo", "Musha", "Ndora", "Nyanza", "Save"],
        "Nyamagabe": ["Kaduha", "Buruhukiro", "Cyanika", "Gatare", "Kamegeri", "Kibirizi", "Mata", "Musange", "Musebeya", "Mutarama", "Mwogo", "Nkomane", "Ruheru", "Rusenge", "Tare"],
        "Ruhango": ["Bweramana", "Byima", "Kabagali", "Kinazi", "Mbuye", "Mwendo", "Ntongwe", "Ruhango"],
        "Muhanga": ["Muhanga", "Cyeza", "Kabacuzi", "Kibangu", "Kiyumba", "Mushishiro", "Nyabinoni", "Nyamabuye", "Nyarusange", "Rongi", "Shyogwe"],
        "Kamonyi": ["Kamonyi", "Gacurabwenge", "Karama", "Kayenzi", "Kayumbu", "Mugina", "Musambira", "Ngamba", "Nyamiyaga", "Nyarubaka", "Rukoma", "Runda"],
        "Nyaruguru": ["Cyahinda", "Kibeho", "Mata", "Muganza", "Munini", "Ngera", "Ngoma", "Nyabimata", "Nyagisozi", "Ruheru", "Ruramba", "Rusenge"],
    },
    "Western Province": {
        "Rubavu": ["Gisenyi", "Bugeshi", "Busasamana", "Cyanzarwe", "Kanama", "Kanzenze", "Mudende", "Nyakiriba", "Nyamyumba", "Nyundo", "Rubavu", "Rugerero"],
        "Rusizi": ["Kamembe", "Bweyeye", "Gashonga", "Giheke", "Gihundwe", "Gikundamvura", "Gitambi", "Muganza", "Mururu", "Nkanka", "Nkombo", "Nkungu", "Ramba"],
        "Nyamasheke": ["Nyamasheke", "Bushekeri", "Bushenge", "Cyato", "Gihombo", "Kagano", "Kanjongo", "Karambi", "Karengera", "Kirimbi", "Mahembe", "Nyabitekeri", "Rangiro", "Ruharambuga", "Shangi"],
        "Karongi": ["Rubengera", "Bwishyura", "Gishari", "Gishyita", "Mubuga", "Murambi", "Murundi", "Mutuntu", "Rugabano", "Ruganda", "Rwankuba", "Twumba"],
        "Rutsiro": ["Gihango", "Cyanika", "Gatumba", "Kavumu", "Kiyumba", "Mukura", "Mushubati", "Nyabirasi", "Ruhango", "Rusebeya"],
        "Ngororero": ["Ngororero", "Bwira", "Gatumba", "Hindiro", "Kabaya", "Kageyo", "Kavumu", "Matyazo", "Muhanda", "Muhororo", "Ndaro", "Nyange"],
        "Nyabihu": ["Mukamira", "Bigogwe", "Jenda", "Kabatwa", "Karago", "Kintobo", "Muringa", "Rambura", "Rugera", "Rurembo", "Shyira"],
    },
    "Eastern Province": {
        "Rwamagana": ["Rwamagana", "Fumbwe", "Gahengeri", "Gishali", "Karenge", "Kigabiro", "Muhazi", "Munyaga", "Munyiginya", "Musha", "Muyumbu", "Mwulire", "Nyakaliro", "Nzige"],
        "Nyagatare": ["Nyagatare", "Gatunda", "Karangazi", "Katabagemu", "Kiyombe", "Matimba", "Mimuri", "Mukama", "Musheri", "Nyakabungo", "Rukomo", "Rwempasha"],
        "Gatsibo": ["Gatsibo", "Gitoki", "Kabaron", "Kageyo", "Kiramuruzi", "Kiziguro", "Muhura", "Murambi", "Ngarama", "Nyagihanga", "Nyamirama", "Remera", "Rugarama", "Rwimbogo"],
        "Kayonza": ["Kayonza", "Gahini", "Kabare", "Kabarondo", "Mukarange", "Murama", "Murundi", "Mwiri", "Ndego", "Nyamirama", "Rukara", "Ruramira", "Rwinkwavu"],
        "Bugesera": ["Nyamata", "Gashora", "Juru", "Kamabuye", "Mareba", "Mayange", "Musenyi", "Mwogo", "Ngeruka", "Ntarama", "Rilima", "Ruhuha", "Rweru", "Shyara"],
        "Ngoma": ["Kibungo", "Gashanda", "Jarama", "Karembo", "Kazo", "Mugesera", "Murama", "Mutenderi", "Remera", "Rukira", "Rukumberi", "Rurenge", "Sake", "Zaza"],
        "Kirche": ["Kirche", "Gahara", "Gatore", "Kigarama", "Kigina", "Mahama", "Mpanga", "Musaza", "Mushikiri", "Nasho", "Nyamugari", "Nyarubuye"],
    },
}

PROVINCE_MULTIPLIER = {
    "Kigali City": 1.0,
    "Northern Province": 0.55,
    "Southern Province": 0.50,
    "Western Province": 0.52,
    "Eastern Province": 0.48,
}

DISTRICT_PREMIUM = {
    "Gasabo": 1.3, "Kicukiro": 1.15, "Nyarugenge": 1.2,
    "Musanze": 1.1, "Rubavu": 1.1, "Rusizi": 1.0, "Huye": 1.05,
}

PROPERTY_TYPES = ["Apartment", "House", "Villa", "Mansion"]

OTHER_FEATURES = ["furnished", "nearby_school", "nearby_hospital", "nearby_road", "security_level", "internet_access", "market_demand", "house_condition"]

rows = []
target = 15000
per_sector = max(3, target // sum(len(sectors) for districts in PROVINCES_DISTRICTS_SECTORS.values() for sectors in districts.values()))

for province, districts in PROVINCES_DISTRICTS_SECTORS.items():
    prov_mult = PROVINCE_MULTIPLIER[province]
    for district, sectors in districts.items():
        dist_prem = DISTRICT_PREMIUM.get(district, 1.0)
        base_price = 25000000 * prov_mult * dist_prem

        for sector in sectors:
            n = random.randint(per_sector - 1, per_sector + 3)
            for _ in range(n):
                bedrooms = random.choices([1,2,3,4,5,6], weights=[8,20,32,24,12,4])[0]
                bathrooms = max(1, bedrooms - random.randint(0,1) if bedrooms > 1 else 1)
                if bedrooms == 1: sqm = random.randint(30, 60)
                elif bedrooms == 2: sqm = random.randint(50, 100)
                elif bedrooms == 3: sqm = random.randint(75, 160)
                elif bedrooms == 4: sqm = random.randint(110, 220)
                elif bedrooms == 5: sqm = random.randint(170, 320)
                else: sqm = random.randint(250, 450)
                sqm = max(25, min(500, sqm))
                parking = random.choices([0,1,2,3], weights=[15,35,35,15])[0]
                year = random.randint(1995, 2025)
                land = sqm * random.uniform(1.5, 5.0)
                land = int(round(land / 10) * 10)

                sqm_factor = sqm / 80
                bed_factor = 1 + (bedrooms - 2) * 0.1
                bath_factor = 1 + (bathrooms - 1) * 0.07
                park_factor = 1 + parking * 0.05
                age_factor = 1 + (year - 1995) * 0.008
                land_factor = 1 + (land / sqm) * 0.1 if sqm > 0 else 1
                noise = random.uniform(0.82, 1.18)

                price = int(base_price * sqm_factor * bed_factor * bath_factor * park_factor * age_factor * land_factor * noise)
                price = int(round(price / 100000) * 100000)
                price = max(price, 3000000)
                price = min(price, 850000000)

                if sqm < 60 and bedrooms <= 2: ptype = "Apartment"
                elif sqm < 100: ptype = random.choices(["Apartment","House"], weights=[55,45])[0]
                elif sqm < 180: ptype = random.choices(["House","Villa"], weights=[65,35])[0]
                elif sqm < 280: ptype = random.choices(["Villa","House","Mansion"], weights=[45,20,35])[0]
                else: ptype = "Mansion"

                furnished = random.choices([0,1], weights=[35,65])[0]
                nearby_school = random.choices([0,1], weights=[10,90])[0]
                nearby_hospital = random.choices([0,1], weights=[20,80])[0]
                nearby_road = random.choices([0,1], weights=[5,95])[0]
                security_level = random.choices([0,1,2], weights=[15,50,35])[0]
                internet_access = random.choices([0,1,2], weights=[10,40,50])[0]
                market_demand = random.choices([0,1,2], weights=[20,50,30])[0]
                house_condition = random.choices([0,1,2], weights=[10,45,45])[0]

                rows.append({
                    "province": province, "district": district, "sector": sector,
                    "property_type": ptype, "bedrooms": bedrooms, "bathrooms": bathrooms,
                    "square_meters": sqm, "parking_spaces": parking, "year_built": year,
                    "furnished": furnished, "nearby_school": nearby_school,
                    "nearby_hospital": nearby_hospital, "nearby_road": nearby_road,
                    "security_level": security_level, "internet_access": internet_access,
                    "market_demand": market_demand, "house_condition": house_condition,
                    "land_size": land, "predicted_market_value": price,
                })

random.shuffle(rows)
output = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rwanda_housing_2026.csv")
with open(output, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=rows[0].keys())
    w.writeheader(); w.writerows(rows)
print(f"Generated {len(rows)} rows -> {output}")
print(f"Price range: {min(r['predicted_market_value'] for r in rows):,} - {max(r['predicted_market_value'] for r in rows):,} RWF")
