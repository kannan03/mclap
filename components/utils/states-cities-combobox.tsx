"use client"
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface Props {
  category: string;
  placeholdername: string;
  country?: string;
  state?: string;
  wPage?:number;
  className?: string
  defultselect?: string;
  disabled?: boolean;
  selectedValue: (value: string) => void;
}
interface StateData {
  [state: string]: string[];
}
const usStatesAndCities: StateData = {
  "Select State": [],
  "Alabama": [ "Birmingham", "Montgomery", "Mobile", "Huntsville"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler"],
  "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
  "Connecticut": ["Bridgeport", "New Haven", "Hartford", "Stamford"],
  "Delaware": ["Wilmington", "Dover", "Newark", "Middletown"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah"],
  "Hawaii": ["Honolulu", "Hilo", "Kailua", "Kaneohe"],
  "Idaho": ["Boise", "Nampa", "Meridian", "Idaho Falls"],
  "Illinois": ["Chicago", "Aurora", "Rockford", "Joliet"],
  "Indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
  "Iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
  "Kansas": ["Wichita", "Overland Park", "Kansas City", "Topeka"],
  "Kentucky": ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
  "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
  "Maine": ["Portland", "Lewiston", "Bangor", "South Portland"],
  "Maryland": ["Baltimore", "Columbia", "Germantown", "Silver Spring"],
  "Massachusetts": ["Boston", "Worcester", "Springfield", "Lowell"],
  "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"],
  "Minnesota": ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
  "Mississippi": ["Jackson", "Gulfport", "Southaven", "Hattiesburg"],
  "Missouri": ["Kansas City", "St. Louis", "Springfield", "Columbia"],
  "Montana": ["Billings", "Missoula", "Great Falls", "Bozeman"],
  "Nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
  "Nevada": ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Dover"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
  "Oregon": ["Portland", "Salem", "Eugene", "Gresham"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket"],
  "South Carolina": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"],
  "Tennessee": ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  "Texas": ["Houston", "San Antonio", "Dallas", "Austin"],
  "Utah": ["Salt Lake City", "West Valley City", "Provo", "Orem"],
  "Vermont": ["Burlington", "Essex", "South Burlington", "Colchester"],
  "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond"],
  "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  "West Virginia": ["Charleston", "Huntington", "Parkersburg", "Morgantown"],
  "Wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
  "Wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette"]
};
const mexicoStatesAndCities: StateData = {
  "Select State": [],
  "Aguascalientes": ["Aguascalientes", "Jesus Maria", "Rincon de Romos"],
  "Baja California": ["Mexicali", "Tijuana", "Ensenada", "Rosarito"],
  "Baja California Sur": ["La Paz", "Los Cabos", "Cabo San Lucas", "La Ribera"],
  "Campeche": ["Campeche", "Ciudad del Carmen", "Champoton"],
  "Chiapas": ["Tuxtla Gutierrez", "San Cristobal de las Casas", "Tapachula"],
  "Chihuahua": ["Chihuahua", "Ciudad Juarez", "Delicias", "Cuauhtemoc"],
  "Coahuila": ["Saltillo", "Torreon", "Monclova", "Piedras Negras"],
  "Colima": ["Colima", "Manzanillo", "Tecoman"],
  "Durango": ["Durango", "Gomez Palacio", "Lerdo"],
  "Guanajuato": ["Leon", "Guanajuato", "Irapuato", "Celaya"],
  "Guerrero": ["Acapulco", "Chilpancingo", "Zihuatanejo", "Iguala"],
  "Hidalgo": ["Pachuca", "Tula", "Tulancingo"],
  "Jalisco": ["Guadalajara", "Puerto Vallarta", "Tlaquepaque", "Tonala"],
  "Mexico": ["Toluca", "Naucalpan", "Ecatepec", "Nezahualcoyotl"],
  "Michoacan": ["Morelia", "Uruapan", "Zamora", "Lazaro Cardenas"],
  "Morelos": ["Cuernavaca", "Cuautla", "Jiutepec", "Temixco"],
  "Nayarit": ["Tepic", "Bahia de Banderas", "Tecuala", "Compostela"],
  "Nuevo Leon": ["Monterrey", "Guadalupe", "San Nicolas de los Garza", "Apodaca"],
  "Oaxaca": ["Oaxaca de Juarez", "Salina Cruz", "Juchitan", "Tuxtepec"],
  "Puebla": ["Puebla", "Tehuacan", "Atlixco", "Cholula"],
  "Queretaro": ["Santiago de Queretaro", "San Juan del Rio", "Corregidora"],
  "Quintana Roo": ["Cancún", "Playa del Carmen", "Chetumal", "Cozumel"],
  "San Luis Potosi": ["San Luis Potosi", "Matehuala", "Ciudad Valles", "Soledad de Graciano Sanchez"],
  "Sinaloa": ["Culiacan", "Mazatlan", "Los Mochis", "Guasave"],
  "Sonora": ["Hermosillo", "Ciudad Obregon", "Nogales", "San Luis Rio Colorado"],
  "Tabasco": ["Villahermosa", "Cardenas", "Comalcalco", "Paraiso"],
  "Tamaulipas": ["Tampico", "Reynosa", "Matamoros", "Nuevo Laredo"],
  "Tlaxcala": ["Tlaxcala de Xicohtencatl", "Huamantla", "Apizaco", "Chiautempan"],
  "Veracruz": ["Veracruz", "Xalapa", "Coatzacoalcos", "Poza Rica"],
  "Yucatan": ["Merida", "Tizimin", "Valladolid", "Progreso"],
  "Zacatecas": ["Zacatecas", "Fresnillo", "Guadalupe", "Jerez"]
};
const usa_states_counties:StateData = {
  "Select County": [],
  "Alabama": ["Autauga", "Baldwin", "Barbour", "Bibb", "Blount", "Bullock", "Butler", "Calhoun", "Chambers", "Cherokee", "Chilton", "Choctaw", "Clarke", "Clay", "Cleburne", "Coffee", "Colbert", "Conecuh", "Coosa", "Covington", "Crenshaw", "Cullman", "Dale", "Dallas", "DeKalb", "Elmore", "Escambia", "Etowah", "Fayette", "Franklin", "Geneva", "Greene", "Hale", "Henry", "Houston", "Jackson", "Jefferson", "Lamar", "Lauderdale", "Lawrence", "Lee", "Limestone", "Lowndes", "Macon", "Madison", "Marengo", "Marion", "Marshall", "Mobile", "Monroe", "Montgomery", "Morgan", "Perry", "Pickens", "Pike", "Randolph", "Russell", "St. Clair", "Shelby", "Sumter", "Talladega", "Tallapoosa", "Tuscaloosa", "Walker", "Washington", "Wilcox", "Winston"],
  "Alaska": ["Aleutians East", "Aleutians West", "Anchorage", "Bethel", "Bristol Bay", "Denali", "Dillingham", "Fairbanks North Star", "Haines", "Hoonah-Angoon", "Juneau", "Kenai Peninsula", "Ketchikan Gateway", "Kodiak Island", "Lake and Peninsula", "Matanuska-Susitna", "Nome", "North Slope", "Northwest Arctic", "Prince of Wales-Hyder", "Sitka", "Skagway", "Southeast Fairbanks", "Valdez-Cordova", "Wade Hampton", "Wrangell", "Yakutat", "Yukon-Koyukuk"],
  "Arizona": ["Apache", "Cochise", "Coconino", "Gila", "Graham", "Greenlee", "La Paz", "Maricopa", "Mohave", "Navajo", "Pima", "Pinal", "Santa Cruz", "Yavapai", "Yuma"],
  "Arkansas": ["Arkansas", "Ashley", "Baxter", "Benton", "Boone", "Bradley", "Calhoun", "Carroll", "Chicot", "Clark", "Clay", "Cleburne", "Cleveland", "Columbia", "Conway", "Craighead", "Crawford", "Crittenden", "Cross", "Dallas", "Desha", "Drew", "Faulkner", "Franklin", "Fulton", "Garland", "Grant", "Greene", "Hempstead", "Hot Spring", "Howard", "Independence", "Izard", "Jackson", "Jefferson", "Johnson", "Lafayette", "Lawrence", "Lee", "Lincoln", "Little River", "Logan", "Lonoke", "Madison", "Marion", "Miller", "Mississippi", "Monroe", "Montgomery", "Nevada", "Newton", "Ouachita", "Perry", "Phillips", "Pike", "Poinsett", "Polk", "Pope", "Prairie", "Pulaski", "Randolph", "St. Francis", "Saline", "Scott", "Searcy", "Sebastian", "Sevier", "Sharp", "Stone", "Union", "Van Buren", "Washington", "White", "Woodruff", "Yell"],
  "California": ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba"],
  "Colorado": ["Adams", "Alamosa", "Arapahoe", "Archuleta", "Baca", "Bent", "Boulder", "Broomfield", "Chaffee", "Cheyenne", "Clear Creek", "Conejos", "Costilla", "Crowley", "Custer", "Delta", "Denver", "Dolores", "Douglas", "Eagle", "El Paso", "Elbert", "Fremont", "Garfield", "Gilpin", "Grand", "Gunnison", "Hinsdale", "Huerfano", "Jackson", "Jefferson", "Kiowa", "Kit Carson", "La Plata", "Lake", "Larimer", "Las Animas", "Lincoln", "Logan", "Mesa", "Mineral", "Moffat", "Montezuma", "Montrose", "Morgan", "Otero", "Ouray", "Park", "Phillips", "Pitkin", "Prowers", "Pueblo", "Rio Blanco", "Rio Grande", "Routt", "Saguache", "San Juan", "San Miguel", "Sedgwick", "Summit", "Teller", "Washington", "Weld", "Yuma"],
  "Connecticut": ["Fairfield", "Hartford", "Litchfield", "Middlesex", "New Haven", "New London", "Tolland", "Windham"],
  "Delaware": ["Kent", "New Castle", "Sussex"],
  "Florida": ["Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun", "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "DeSoto", "Dixie", "Duval", "Escambia", "Flagler", "Franklin", "Gadsden", "Gilchrist", "Glades", "Gulf", "Hamilton", "Hardee", "Hendry", "Hernando", "Highlands", "Hillsborough", "Holmes", "Indian River", "Jackson", "Jefferson", "Lafayette", "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison", "Manatee", "Marion", "Martin", "Miami-Dade", "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange", "Osceola", "Palm Beach", "Pasco", "Pinellas", "Polk", "Putnam", "St. Johns", "St. Lucie", "Santa Rosa", "Sarasota", "Seminole", "Sumter", "Suwannee", "Taylor", "Union", "Volusia", "Wakulla", "Walton", "Washington"],
  "Georgia": ["Appling", "Atkinson", "Bacon", "Baker", "Baldwin", "Banks", "Barrow", "Bartow", "Ben Hill", "Berrien", "Bibb", "Bleckley", "Brantley", "Brooks", "Bryan", "Bulloch", "Burke", "Butts", "Calhoun", "Camden", "Candler", "Carroll", "Catoosa", "Charlton", "Chatham", "Chattahoochee", "Chattooga", "Cherokee", "Clarke", "Clay", "Clayton", "Clinch", "Cobb", "Coffee", "Colquitt", "Columbia", "Cook", "Coweta", "Crawford", "Crisp", "Dade", "Dawson", "Decatur", "DeKalb", "Dodge", "Dooly", "Dougherty", "Douglas", "Early", "Echols", "Effingham", "Elbert", "Emanuel", "Evans", "Fannin", "Fayette", "Floyd", "Forsyth", "Franklin", "Fulton", "Gilmer", "Glascock", "Glynn", "Gordon", "Grady", "Greene", "Gwinnett", "Habersham", "Hall", "Hancock", "Haralson", "Harris", "Hart", "Heard", "Henry", "Houston", "Irwin", "Jackson", "Jasper", "Jeff Davis", "Jefferson", "Jenkins", "Johnson", "Jones", "Lamar", "Lanier", "Laurens", "Lee", "Liberty", "Lincoln", "Long", "Lowndes", "Lumpkin", "McDuffie", "McIntosh", "Macon", "Madison", "Marion", "Meriwether", "Miller", "Mitchell", "Monroe", "Montgomery", "Morgan", "Murray", "Muscogee", "Newton", "Oconee", "Oglethorpe", "Paulding", "Peach", "Pickens", "Pierce", "Pike", "Polk", "Pulaski", "Putnam", "Quitman", "Rabun", "Randolph", "Richmond", "Rockdale", "Schley", "Screven", "Seminole", "Spalding", "Stephens", "Stewart", "Sumter", "Talbot", "Taliaferro", "Tattnall", "Taylor", "Telfair", "Terrell", "Thomas", "Tift", "Toombs", "Towns", "Treutlen", "Troup", "Turner", "Twiggs", "Union", "Upson", "Walker", "Walton", "Ware", "Warren", "Washington", "Wayne", "Webster", "Wheeler", "White", "Whitfield", "Wilcox", "Wilkes", "Wilkinson", "Worth"],
  "Hawaii": ["Hawaii", "Honolulu", "Kalawao", "Kauai", "Maui"],
  "Idaho": ["Ada", "Adams", "Bannock", "Bear Lake", "Benewah", "Bingham", "Blaine", "Boise", "Bonner", "Bonneville", "Boundary", "Butte", "Camas", "Canyon", "Caribou", "Cassia", "Clark", "Clearwater", "Custer", "Elmore", "Franklin", "Fremont", "Gem", "Gooding", "Idaho", "Jefferson", "Jerome", "Kootenai", "Latah", "Lemhi", "Lewis", "Lincoln", "Madison", "Minidoka", "Nez Perce", "Oneida", "Owyhee", "Payette", "Power", "Shoshone", "Teton", "Twin Falls", "Valley", "Washington"],
  "Illinois": ["Adams", "Alexander", "Bond", "Boone", "Brown", "Bureau", "Calhoun", "Carroll", "Cass", "Champaign", "Christian", "Clark", "Clay", "Clinton", "Coles", "Cook", "Crawford", "Cumberland", "DeKalb", "DeWitt", "Douglas", "DuPage", "Edgar", "Edwards", "Effingham", "Fayette", "Ford", "Franklin", "Fulton", "Gallatin", "Greene", "Grundy", "Hamilton", "Hancock", "Hardin", "Henderson", "Henry", "Iroquois", "Jackson", "Jasper", "Jefferson", "Jersey", "Jo Daviess", "Johnson", "Kane", "Kankakee", "Kendall", "Knox", "LaSalle", "Lake", "Lawrence", "Lee", "Livingston", "Logan", "McDonough", "McHenry", "McLean", "Macon", "Macoupin", "Madison", "Marion", "Marshall", "Mason", "Massac", "Menard", "Mercer", "Monroe", "Montgomery", "Morgan", "Moultrie", "Ogle", "Peoria", "Perry", "Piatt", "Pike", "Pope", "Pulaski", "Putnam", "Randolph", "Richland", "Rock Island", "Saline", "Sangamon", "Schuyler", "Scott", "Shelby", "St. Clair", "Stark", "Stephenson", "Tazewell", "Union", "Vermilion", "Wabash", "Warren", "Washington", "Wayne", "White", "Whiteside", "Will", "Williamson", "Winnebago", "Woodford"],
  "Indiana": ["Adams", "Allen", "Bartholomew", "Benton", "Blackford", "Boone", "Brown", "Carroll", "Cass", "Clark", "Clay", "Clinton", "Crawford", "Daviess", "Dearborn", "Decatur", "DeKalb", "Delaware", "Dubois", "Elkhart", "Fayette", "Floyd", "Fountain", "Franklin", "Fulton", "Gibson", "Grant", "Greene", "Hamilton", "Hancock", "Harrison", "Hendricks", "Henry", "Howard", "Huntington", "Jackson", "Jasper", "Jay", "Jefferson", "Jennings", "Johnson", "Knox", "Kosciusko", "LaGrange", "Lake", "LaPorte", "Lawrence", "Madison", "Marion", "Marshall", "Martin", "Miami", "Monroe", "Montgomery", "Morgan", "Newton", "Noble", "Ohio", "Orange", "Owen", "Parke", "Perry", "Pike", "Porter", "Posey", "Pulaski", "Putnam", "Randolph", "Ripley", "Rush", "St. Joseph", "Scott", "Shelby", "Spencer", "Starke", "Steuben", "Sullivan", "Switzerland", "Tippecanoe", "Tipton", "Union", "Vanderburgh", "Vermillion", "Vigo", "Wabash", "Warren", "Warrick", "Washington", "Wayne", "Wells", "White", "Whitley"],
  "Iowa": ["Adair", "Adams", "Allamakee", "Appanoose", "Audubon", "Benton", "Black Hawk", "Boone", "Bremer", "Buchanan", "Buena Vista", "Butler", "Calhoun", "Carroll", "Cass", "Cedar", "Cerro Gordo", "Cherokee", "Chickasaw", "Clarke", "Clay", "Clayton", "Clinton", "Crawford", "Dallas", "Davis", "Decatur", "Delaware", "Des Moines", "Dickinson", "Dubuque", "Emmet", "Fayette", "Floyd", "Franklin", "Fremont", "Greene", "Grundy", "Guthrie", "Hamilton", "Hancock", "Hardin", "Harrison", "Henry", "Howard", "Humboldt", "Ida", "Iowa", "Jackson", "Jasper", "Jefferson", "Johnson", "Jones", "Keokuk", "Kossuth", "Lee", "Linn", "Louisa", "Lucas", "Lyon", "Madison", "Mahaska", "Marion", "Marshall", "Mills", "Mitchell", "Monona", "Monroe", "Montgomery", "Muscatine", "O'Brien", "Osceola", "Page", "Palo Alto", "Plymouth", "Pocahontas", "Polk", "Pottawattamie", "Poweshiek", "Ringgold", "Sac", "Scott", "Shelby", "Sioux", "Story", "Tama", "Taylor", "Union", "Van Buren", "Wapello", "Warren", "Washington", "Wayne", "Webster", "Winnebago", "Winneshiek", "Woodbury", "Worth", "Wright"],
  "Kansas": ["Allen", "Anderson", "Atchison", "Barber", "Barton", "Bourbon", "Brown", "Butler", "Chase", "Chautauqua", "Cherokee", "Cheyenne", "Clark", "Clay", "Cloud", "Coffey", "Comanche", "Cowley", "Crawford", "Decatur", "Dickinson", "Doniphan", "Douglas", "Edwards", "Elk", "Ellis", "Ellsworth", "Finney", "Ford", "Franklin", "Geary", "Gove", "Graham", "Grant", "Gray", "Greeley", "Greenwood", "Hamilton", "Harper", "Harvey", "Haskell", "Hodgeman", "Jackson", "Jefferson", "Jewell", "Johnson", "Kearny", "Kingman", "Kiowa", "Labette", "Lane", "Leavenworth", "Lincoln", "Linn", "Logan", "Lyon", "McPherson", "Marion", "Marshall", "Meade", "Miami", "Mitchell", "Montgomery", "Morris", "Morton", "Nemaha", "Neosho", "Ness", "Norton", "Osage", "Osborne", "Ottawa", "Pawnee", "Phillips", "Pottawatomie", "Pratt", "Rawlins", "Reno", "Republic", "Rice", "Riley", "Rooks", "Rush", "Russell", "Saline", "Scott", "Sedgwick", "Seward", "Shawnee", "Sheridan", "Sherman", "Smith", "Stafford", "Stanton", "Stevens", "Sumner", "Thomas", "Trego", "Wabaunsee", "Wallace", "Washington", "Wichita", "Wilson", "Woodson", "Wyandotte"],
  "Kentucky": ["Adair", "Allen", "Anderson", "Ballard", "Barren", "Bath", "Bell", "Boone", "Bourbon", "Boyd", "Boyle", "Bracken", "Breathitt", "Breckinridge", "Bullitt", "Butler", "Caldwell", "Calloway", "Campbell", "Carlisle", "Carroll", "Carter", "Casey", "Christian", "Clark", "Clay", "Clinton", "Crittenden", "Cumberland", "Daviess", "Edmonson", "Elliott", "Estill", "Fayette", "Fleming", "Floyd", "Franklin", "Fulton", "Gallatin", "Garrard", "Grant", "Graves", "Grayson", "Green", "Greenup", "Hancock", "Hardin", "Harlan", "Harrison", "Hart", "Henderson", "Henry", "Hickman", "Hopkins", "Jackson", "Jefferson", "Jessamine", "Johnson", "Kenton", "Knott", "Knox", "Larue", "Laurel", "Lawrence", "Lee", "Leslie", "Letcher", "Lewis", "Lincoln", "Livingston", "Logan", "Lyon", "McCracken", "McCreary", "McLean", "Madison", "Magoffin", "Marion", "Marshall", "Martin", "Mason", "Meade", "Menifee", "Mercer", "Metcalfe", "Monroe", "Montgomery", "Morgan", "Muhlenberg", "Nelson", "Nicholas", "Ohio", "Oldham", "Owen", "Owsley", "Pendleton", "Perry", "Pike", "Powell", "Pulaski", "Robertson", "Rockcastle", "Rowan", "Russell", "Scott", "Shelby", "Simpson", "Spencer", "Taylor", "Todd", "Trigg", "Trimble", "Union", "Warren", "Washington", "Wayne", "Webster", "Whitley", "Wolfe", "Woodford"],
  "Louisiana": ["Acadia", "Allen", "Ascension", "Assumption", "Avoyelles", "Beauregard", "Bienville", "Bossier", "Caddo", "Calcasieu", "Caldwell", "Cameron", "Catahoula", "Claiborne", "Concordia", "De Soto", "East Baton Rouge", "East Carroll", "East Feliciana", "Evangeline", "Franklin", "Grant", "Iberia", "Iberville", "Jackson", "Jefferson", "Jefferson Davis", "La Salle", "Lafayette", "Lafourche", "Lincoln", "Livingston", "Madison", "Morehouse", "Natchitoches", "Orleans", "Ouachita", "Plaquemines", "Pointe Coupee", "Rapides", "Red River", "Richland", "Sabine", "St. Bernard", "St. Charles", "St. Helena", "St. James", "St. John the Baptist", "St. Landry", "St. Martin", "St. Mary", "St. Tammany", "Tangipahoa", "Tensas", "Terrebonne", "Union", "Vermilion", "Vernon", "Washington", "Webster", "West Baton Rouge", "West Carroll", "West Feliciana", "Winn"],
  "Maine": ["Androscoggin", "Aroostook", "Cumberland", "Franklin", "Hancock", "Kennebec", "Knox", "Lincoln", "Oxford", "Penobscot", "Piscataquis", "Sagadahoc", "Somerset", "Waldo", "Washington", "York"],
  "Maryland": ["Allegany", "Anne Arundel", "Baltimore", "Calvert", "Caroline", "Carroll", "Cecil", "Charles", "Dorchester", "Frederick", "Garrett", "Harford", "Howard", "Kent", "Montgomery", "Prince George's", "Queen Anne's", "St. Mary's", "Somerset", "Talbot", "Washington", "Wicomico", "Worcester"],
  "Massachusetts": ["Barnstable", "Berkshire", "Bristol", "Dukes", "Essex", "Franklin", "Hampden", "Hampshire", "Middlesex", "Nantucket", "Norfolk", "Plymouth", "Suffolk", "Worcester"],
  "Michigan": ["Alcona", "Alger", "Allegan", "Alpena", "Antrim", "Arenac", "Baraga", "Barry", "Bay", "Benzie", "Berrien", "Branch", "Calhoun", "Cass", "Charlevoix", "Cheboygan", "Chippewa", "Clare", "Clinton", "Crawford", "Delta", "Dickinson", "Eaton", "Emmet", "Genesee", "Gladwin", "Gogebic", "Grand Traverse", "Gratiot", "Hillsdale", "Houghton", "Huron", "Ingham", "Ionia", "Iosco", "Iron", "Isabella", "Jackson", "Kalamazoo", "Kalkaska", "Kent", "Keweenaw", "Lake", "Lapeer", "Leelanau", "Lenawee", "Livingston", "Luce", "Mackinac", "Macomb", "Manistee", "Marquette", "Mason", "Mecosta", "Menominee", "Midland", "Missaukee", "Monroe", "Montcalm", "Montmorency", "Muskegon", "Newaygo", "Oakland", "Oceana", "Ogemaw", "Ontonagon", "Osceola", "Oscoda", "Otsego", "Ottawa", "Presque Isle", "Roscommon", "Saginaw", "St. Clair", "St. Joseph", "Sanilac", "Schoolcraft", "Shiawassee", "Tuscola", "Van Buren", "Washtenaw", "Wayne", "Wexford"],
  "Minnesota": ["Aitkin", "Anoka", "Becker", "Beltrami", "Benton", "Big Stone", "Blue Earth", "Brown", "Carlton", "Carver", "Cass", "Chippewa", "Chisago", "Clay", "Clearwater", "Cook", "Cottonwood", "Crow Wing", "Dakota", "Dodge", "Douglas", "Faribault", "Fillmore", "Freeborn", "Goodhue", "Grant", "Hennepin", "Houston", "Hubbard", "Isanti", "Itasca", "Jackson", "Kanabec", "Kandiyohi", "Kittson", "Koochiching", "Lac qui Parle", "Lake", "Lake of the Woods", "Le Sueur", "Lincoln", "Lyon", "McLeod", "Mahnomen", "Marshall", "Martin", "Meeker", "Mille Lacs", "Morrison", "Mower", "Murray", "Nicollet", "Nobles", "Norman", "Olmsted", "Otter Tail", "Pennington", "Pine", "Pipestone", "Polk", "Pope", "Ramsey", "Red Lake", "Redwood", "Renville", "Rice", "Rock", "Roseau", "St. Louis", "Scott", "Sherburne", "Sibley", "Stearns", "Steele", "Stevens", "Swift", "Todd", "Traverse", "Wabasha", "Wadena", "Waseca", "Washington", "Watonwan", "Wilkin", "Winona", "Wright", "Yellow Medicine"],
  "Mississippi": ["Adams", "Alcorn", "Amite", "Attala", "Benton", "Bolivar", "Calhoun", "Carroll", "Chickasaw", "Choctaw", "Claiborne", "Clarke", "Clay", "Coahoma", "Copiah", "Covington", "DeSoto", "Forrest", "Franklin", "George", "Greene", "Grenada", "Hancock", "Harrison", "Hinds", "Holmes", "Humphreys", "Issaquena", "Itawamba", "Jackson", "Jasper", "Jefferson", "Jefferson Davis", "Jones", "Kemper", "Lafayette", "Lamar", "Lauderdale", "Lawrence", "Leake", "Lee", "Leflore", "Lincoln", "Lowndes", "Madison", "Marion", "Marshall", "Monroe", "Montgomery", "Neshoba", "Newton", "Noxubee", "Oktibbeha", "Panola", "Pearl River", "Perry", "Pike", "Pontotoc", "Prentiss", "Quitman", "Rankin", "Scott", "Sharkey", "Simpson", "Smith", "Stone", "Sunflower", "Tallahatchie", "Tate", "Tippah", "Tishomingo", "Tunica", "Union", "Walthall", "Warren", "Washington", "Wayne", "Webster", "Wilkinson", "Winston", "Yalobusha", "Yazoo"],
  "Missouri": ["Adair", "Andrew", "Atchison", "Audrain", "Barry", "Barton", "Bates", "Benton", "Bollinger", "Boone", "Buchanan", "Butler", "Caldwell", "Callaway", "Camden", "Cape Girardeau", "Carroll", "Carter", "Cass", "Cedar", "Chariton", "Christian", "Clark", "Clay", "Clinton", "Cole", "Cooper", "Crawford", "Dade", "Dallas", "Daviess", "DeKalb", "Dent", "Douglas", "Dunklin", "Franklin", "Gasconade", "Gentry", "Greene", "Grundy", "Harrison", "Henry", "Hickory", "Holt", "Howard", "Howell", "Iron", "Jackson", "Jasper", "Jefferson", "Johnson", "Knox", "Laclede", "Lafayette", "Lawrence", "Lewis", "Lincoln", "Linn", "Livingston", "McDonald", "Macon", "Madison", "Maries", "Marion", "Mercer", "Miller", "Mississippi", "Moniteau", "Monroe", "Montgomery", "Morgan", "New Madrid", "Newton", "Nodaway", "Oregon", "Osage", "Ozark", "Pemiscot", "Perry", "Pettis", "Phelps", "Pike", "Platte", "Polk", "Pulaski", "Putnam", "Ralls", "Randolph", "Ray", "Reynolds", "Ripley", "St. Charles", "St. Clair", "Ste. Genevieve", "St. Francois", "St. Louis", "St. Louis (city)", "Saline", "Schuyler", "Scotland", "Scott", "Shannon", "Shelby", "Stoddard", "Stone", "Sullivan", "Taney", "Texas", "Vernon", "Warren", "Washington", "Wayne", "Webster", "Worth", "Wright"],
  "Montana": ["Beaverhead", "Big Horn", "Blaine", "Broadwater", "Carbon", "Carter", "Cascade", "Chouteau", "Custer", "Daniels", "Dawson", "Deer Lodge", "Fallon", "Fergus", "Flathead", "Gallatin", "Garfield", "Glacier", "Golden Valley", "Granite", "Hill", "Jefferson", "Judith Basin", "Lake", "Lewis and Clark", "Liberty", "Lincoln", "McCone", "Madison", "Meagher", "Mineral", "Missoula", "Musselshell", "Park", "Petroleum", "Phillips", "Pondera", "Powder River", "Powell", "Prairie", "Ravalli", "Richland", "Roosevelt", "Rosebud", "Sanders", "Sheridan", "Silver Bow", "Stillwater", "Sweet Grass", "Teton", "Toole", "Treasure", "Valley", "Wheatland", "Wibaux", "Yellowstone"],
  "Nebraska": ["Adams", "Antelope", "Arthur", "Banner", "Blaine", "Boone", "Box Butte", "Boyd", "Brown", "Buffalo", "Burt", "Butler", "Cass", "Cedar", "Chase", "Cherry", "Cheyenne", "Clay", "Colfax", "Cuming", "Custer", "Dakota", "Dawes", "Dawson", "Deuel", "Dixon", "Dodge", "Douglas", "Dundy", "Fillmore", "Franklin", "Frontier", "Furnas", "Gage", "Garden", "Garfield", "Gosper", "Grant", "Greeley", "Hall", "Hamilton", "Harlan", "Hayes", "Hitchcock", "Holt", "Hooker", "Howard", "Jefferson", "Johnson", "Kearney", "Keith", "Keya Paha", "Kimball", "Knox", "Lancaster", "Lincoln", "Logan", "Loup", "McPherson", "Madison", "Merrick", "Morrill", "Nance", "Nemaha", "Nuckolls", "Otoe", "Pawnee", "Perkins", "Phelps", "Pierce", "Platte", "Polk", "Red Willow", "Richardson", "Rock", "Saline", "Sarpy", "Saunders", "Scotts Bluff", "Seward", "Sheridan", "Sherman", "Sioux", "Stanton", "Thayer", "Thomas", "Thurston", "Valley", "Washington", "Wayne", "Webster", "Wheeler", "York"],
  "Nevada": ["Churchill", "Clark", "Douglas", "Elko", "Esmeralda", "Eureka", "Humboldt", "Lander", "Lincoln", "Lyon", "Mineral", "Nye", "Pershing", "Storey", "Washoe", "White Pine"],
  "New Hampshire": ["Belknap", "Carroll", "Cheshire", "Coos", "Grafton", "Hillsborough", "Merrimack", "Rockingham", "Strafford", "Sullivan"],
  "New Jersey": ["Atlantic", "Bergen", "Burlington", "Camden", "Cape May", "Cumberland", "Essex", "Gloucester", "Hudson", "Hunterdon", "Mercer", "Middlesex", "Monmouth", "Morris", "Ocean", "Passaic", "Salem", "Somerset", "Sussex", "Union", "Warren"],
  "New Mexico": ["Bernalillo", "Catron", "Chaves", "Cibola", "Colfax", "Curry", "De Baca", "Dona Ana", "Eddy", "Grant", "Guadalupe", "Harding", "Hidalgo", "Lea", "Lincoln", "Los Alamos", "Luna", "McKinley", "Mora", "Otero", "Quay", "Rio Arriba", "Roosevelt", "Sandoval", "San Juan", "San Miguel", "Santa Fe", "Sierra", "Socorro", "Taos", "Torrance", "Union", "Valencia"],
  "New York": ["Albany", "Allegany", "Bronx", "Broome", "Cattaraugus", "Cayuga", "Chautauqua", "Chemung", "Chenango", "Clinton", "Columbia", "Cortland", "Delaware", "Dutchess", "Erie", "Essex", "Franklin", "Fulton", "Genesee", "Greene", "Hamilton", "Herkimer", "Jefferson", "Kings", "Lewis", "Livingston", "Madison", "Monroe", "Montgomery", "Nassau", "New York", "Niagara", "Oneida", "Onondaga", "Ontario", "Orange", "Orleans", "Oswego", "Otsego", "Putnam", "Queens", "Rensselaer", "Richmond", "Rockland", "St. Lawrence", "Saratoga", "Schenectady", "Schoharie", "Schuyler", "Seneca", "Steuben", "Suffolk", "Sullivan", "Tioga", "Tompkins", "Ulster", "Warren", "Washington", "Wayne", "Westchester", "Wyoming", "Yates"],
  "North Carolina": ["Alamance", "Alexander", "Alleghany", "Anson", "Ashe", "Avery", "Beaufort", "Bertie", "Bladen", "Brunswick", "Buncombe", "Burke", "Cabarrus", "Caldwell", "Camden", "Carteret", "Caswell", "Catawba", "Chatham", "Cherokee", "Chowan", "Clay", "Cleveland", "Columbus", "Craven", "Cumberland", "Currituck", "Dare", "Davidson", "Davie", "Duplin", "Durham", "Edgecombe", "Forsyth", "Franklin", "Gaston", "Gates", "Graham", "Granville", "Greene", "Guilford", "Halifax", "Harnett", "Haywood", "Henderson", "Hertford", "Hoke", "Hyde", "Iredell", "Jackson", "Johnston", "Jones", "Lee", "Lenoir", "Lincoln", "McDowell", "Macon", "Madison", "Martin", "Mecklenburg", "Mitchell", "Montgomery", "Moore", "Nash", "New Hanover", "Northampton", "Onslow", "Orange", "Pamlico", "Pasquotank", "Pender", "Perquimans", "Person", "Pitt", "Polk", "Randolph", "Richmond", "Robeson", "Rockingham", "Rowan", "Rutherford", "Sampson", "Scotland", "Stanly", "Stokes", "Surry", "Swain", "Transylvania", "Tyrrell", "Union", "Vance", "Wake", "Warren", "Washington", "Watauga", "Wayne", "Wilkes", "Wilson", "Yadkin", "Yancey"],
  "North Dakota": ["Adams", "Barnes", "Benson", "Billings", "Bottineau", "Bowman", "Burke", "Burleigh", "Cass", "Cavalier", "Dickey", "Divide", "Dunn", "Eddy", "Emmons", "Foster", "Golden Valley", "Grand Forks", "Grant", "Griggs", "Hettinger", "Kidder", "LaMoure", "Logan", "McHenry", "McIntosh", "McKenzie", "McLean", "Mercer", "Morton", "Mountrail", "Nelson", "Oliver", "Pembina", "Pierce", "Ramsey", "Ransom", "Renville", "Richland", "Rolette", "Sargent", "Sheridan", "Sioux", "Slope", "Stark", "Steele", "Stutsman", "Towner", "Traill", "Walsh", "Ward", "Wells", "Williams"],
  "Ohio": ["Adams", "Allen", "Ashland", "Ashtabula", "Athens", "Auglaize", "Belmont", "Brown", "Butler", "Carroll", "Champaign", "Clark", "Clermont", "Clinton", "Columbiana", "Coshocton", "Crawford", "Cuyahoga", "Darke", "Defiance", "Delaware", "Erie", "Fairfield", "Fayette", "Franklin", "Fulton", "Gallia", "Geauga", "Greene", "Guernsey", "Hamilton", "Hancock", "Hardin", "Harrison", "Henry", "Highland", "Hocking", "Holmes", "Huron", "Jackson", "Jefferson", "Knox", "Lake", "Lawrence", "Licking", "Logan", "Lorain", "Lucas", "Madison", "Mahoning", "Marion", "Medina", "Meigs", "Mercer", "Miami", "Monroe", "Montgomery", "Morgan", "Morrow", "Muskingum", "Noble", "Ottawa", "Paulding", "Perry", "Pickaway", "Pike", "Portage", "Preble", "Putnam", "Richland", "Ross", "Sandusky", "Scioto", "Seneca", "Shelby", "Stark", "Summit", "Trumbull", "Tuscarawas", "Union", "Van Wert", "Vinton", "Warren", "Washington", "Wayne", "Williams", "Wood", "Wyandot"],
  "Oklahoma": ["Adair", "Alfalfa", "Atoka", "Beaver", "Beckham", "Blaine", "Bryan", "Caddo", "Canadian", "Carter", "Cherokee", "Choctaw", "Cimarron", "Cleveland", "Coal", "Comanche", "Cotton", "Craig", "Creek", "Custer", "Delaware", "Dewey", "Ellis", "Garfield", "Garvin", "Grady", "Grant", "Greer", "Harmon", "Harper", "Haskell", "Hughes", "Jackson", "Jefferson", "Johnston", "Kay", "Kingfisher", "Kiowa", "Latimer", "Le Flore", "Lincoln", "Logan", "Love", "McClain", "McCurtain", "McIntosh", "Major", "Marshall", "Mayes", "Murray", "Muskogee", "Noble", "Nowata", "Okfuskee", "Oklahoma", "Okmulgee", "Osage", "Ottawa", "Pawnee", "Payne", "Pittsburg", "Pontotoc", "Pottawatomie", "Pushmataha", "Roger Mills", "Rogers", "Seminole", "Sequoyah", "Stephens", "Texas", "Tillman", "Tulsa", "Wagoner", "Washington", "Washita", "Woods", "Woodward"],
  "Oregon": ["Baker", "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Crook", "Curry", "Deschutes", "Douglas", "Gilliam", "Grant", "Harney", "Hood River", "Jackson", "Jefferson", "Josephine", "Klamath", "Lake", "Lane", "Lincoln", "Linn", "Malheur", "Marion", "Morrow", "Multnomah", "Polk", "Sherman", "Tillamook", "Umatilla", "Union", "Wallowa", "Wasco", "Washington", "Wheeler", "Yamhill"],
  "Pennsylvania": ["Adams", "Allegheny", "Armstrong", "Beaver", "Bedford", "Berks", "Blair", "Bradford", "Bucks", "Butler", "Cambria", "Cameron", "Carbon", "Centre", "Chester", "Clarion", "Clearfield", "Clinton", "Columbia", "Crawford", "Cumberland", "Dauphin", "Delaware", "Elk", "Erie", "Fayette", "Forest", "Franklin", "Fulton", "Greene", "Huntingdon", "Indiana", "Jefferson", "Juniata", "Lackawanna", "Lancaster", "Lawrence", "Lebanon", "Lehigh", "Luzerne", "Lycoming", "McKean", "Mercer", "Mifflin", "Monroe", "Montgomery", "Montour", "Northampton", "Northumberland", "Perry", "Philadelphia", "Pike", "Potter", "Schuylkill", "Snyder", "Somerset", "Sullivan", "Susquehanna", "Tioga", "Union", "Venango", "Warren", "Washington", "Wayne", "Westmoreland", "Wyoming", "York"],
  "Rhode Island": ["Bristol", "Kent", "Newport", "Providence", "Washington"],
  "South Carolina": ["Abbeville", "Aiken", "Allendale", "Anderson", "Bamberg", "Barnwell", "Beaufort", "Berkeley", "Calhoun", "Charleston", "Cherokee", "Chester", "Chesterfield", "Clarendon", "Colleton", "Darlington", "Dillon", "Dorchester", "Edgefield", "Fairfield", "Florence", "Georgetown", "Greenville", "Greenwood", "Hampton", "Horry", "Jasper", "Kershaw", "Lancaster", "Laurens", "Lee", "Lexington", "McCormick", "Marion", "Marlboro", "Newberry", "Oconee", "Orangeburg", "Pickens", "Richland", "Saluda", "Spartanburg", "Sumter", "Union", "Williamsburg", "York"],
  "South Dakota": ["Aurora", "Beadle", "Bennett", "Bon Homme", "Brookings", "Brown", "Brule", "Buffalo", "Butte", "Campbell", "Charles Mix", "Clark", "Clay", "Codington", "Corson", "Custer", "Davison", "Day", "Deuel", "Dewey", "Douglas", "Edmunds", "Fall River", "Faulk", "Grant", "Gregory", "Haakon", "Hamlin", "Hand", "Hanson", "Harding", "Hughes", "Hutchinson", "Hyde", "Jackson", "Jerauld", "Jones", "Kingsbury", "Lake", "Lawrence", "Lincoln", "Lyman", "McCook", "McPherson", "Marshall", "Meade", "Mellette", "Miner", "Minnehaha", "Moody", "Pennington", "Perkins", "Potter", "Roberts", "Sanborn", "Shannon", "Spink", "Stanley", "Sully", "Todd", "Tripp", "Turner", "Union", "Walworth", "Yankton", "Ziebach"],
  "Tennessee": ["Anderson", "Bedford", "Benton", "Bledsoe", "Blount", "Bradley", "Campbell", "Cannon", "Carroll", "Carter", "Cheatham", "Chester", "Claiborne", "Clay", "Cocke", "Coffee", "Crockett", "Cumberland", "Davidson", "Decatur", "DeKalb", "Dickson", "Dyer", "Fayette", "Fentress", "Franklin", "Gibson", "Giles", "Grainger", "Greene", "Grundy", "Hamblen", "Hamilton", "Hancock", "Hardeman", "Hardin", "Hawkins", "Haywood", "Henderson", "Henry", "Hickman", "Houston", "Humphreys", "Jackson", "Jefferson", "Johnson", "Knox", "Lake", "Lauderdale", "Lawrence", "Lewis", "Lincoln", "Loudon", "McMinn", "McNairy", "Macon", "Madison", "Marion", "Marshall", "Maury", "Meigs", "Monroe", "Montgomery", "Moore", "Morgan", "Obion", "Overton", "Perry", "Pickett", "Polk", "Putnam", "Rhea", "Roane", "Robertson", "Rutherford", "Scott", "Sequatchie", "Sevier", "Shelby", "Smith", "Stewart", "Sullivan", "Sumner", "Tipton", "Trousdale", "Unicoi", "Union", "Van Buren", "Warren", "Washington", "Wayne", "Weakley", "White", "Williamson", "Wilson"],
  "Texas": ["Anderson", "Andrews", "Angelina", "Aransas", "Archer", "Armstrong", "Atascosa", "Austin", "Bailey", "Bandera", "Bastrop", "Baylor", "Bee", "Bell", "Bexar", "Blanco", "Borden", "Bosque", "Bowie", "Brazoria", "Brazos", "Brewster", "Briscoe", "Brooks", "Brown", "Burleson", "Burnet", "Caldwell", "Calhoun", "Callahan", "Cameron", "Camp", "Carson", "Cass", "Castro", "Chambers", "Cherokee", "Childress", "Clay", "Cochran", "Coke", "Coleman", "Collin", "Collingsworth", "Colorado", "Comal", "Comanche", "Concho", "Cooke", "Coryell", "Cottle", "Crane", "Crockett", "Crosby", "Culberson", "Dallam", "Dallas", "Dawson", "Deaf Smith", "Delta", "Denton", "DeWitt", "Dickens", "Dimmit", "Donley", "Duval", "Eastland", "Ector", "Edwards", "Ellis", "El Paso", "Erath", "Falls", "Fannin", "Fayette", "Fisher", "Floyd", "Foard", "Fort Bend", "Franklin", "Freestone", "Frio", "Gaines", "Galveston", "Garza", "Gillespie", "Glasscock", "Goliad", "Gonzales", "Gray", "Grayson", "Gregg", "Grimes", "Guadalupe", "Hale", "Hall", "Hamilton", "Hansford", "Hardeman", "Hardin", "Harris", "Harrison", "Hartley", "Haskell", "Hays", "Hemphill", "Henderson", "Hidalgo", "Hill", "Hockley", "Hood", "Hopkins", "Houston", "Howard", "Hudspeth", "Hunt", "Hutchinson", "Irion", "Jack", "Jackson", "Jasper", "Jeff Davis", "Jefferson", "Jim Hogg", "Jim Wells", "Johnson", "Jones", "Karnes", "Kaufman", "Kendall", "Kenedy", "Kent", "Kerr", "Kimble", "King", "Kinney", "Kleberg", "Knox", "Lamar", "Lamb", "Lampasas", "La Salle", "Lavaca", "Lee", "Leon", "Liberty", "Limestone", "Lipscomb", "Live Oak", "Llano", "Loving", "Lubbock", "Lynn", "McCulloch", "McLennan", "McMullen", "Madison", "Marion", "Martin", "Mason", "Matagorda", "Maverick", "Medina", "Menard", "Midland", "Milam", "Mills", "Mitchell", "Montague", "Montgomery", "Moore", "Morris", "Motley", "Nacogdoches", "Navarro", "Newton", "Nolan", "Nueces", "Ochiltree", "Oldham", "Orange", "Palo Pinto", "Panola", "Parker", "Parmer", "Pecos", "Polk", "Potter", "Presidio", "Rains", "Randall", "Reagan", "Real", "Red River", "Reeves", "Refugio", "Roberts", "Robertson", "Rockwall", "Runnels", "Rusk", "Sabine", "San Augustine", "San Jacinto", "San Patricio", "San Saba", "Schleicher", "Scurry", "Shackelford", "Shelby", "Sherman", "Smith", "Somervell", "Starr", "Stephens", "Sterling", "Stonewall", "Sutton", "Swisher", "Tarrant", "Taylor", "Terrell", "Terry", "Throckmorton", "Titus", "Tom Green", "Travis", "Trinity", "Tyler", "Upshur", "Upton", "Uvalde", "Val Verde", "Van Zandt", "Victoria", "Walker", "Waller", "Ward", "Washington", "Webb", "Wharton", "Wheeler", "Wichita", "Wilbarger", "Willacy", "Williamson", "Wilson", "Winkler", "Wise", "Wood", "Yoakum", "Young", "Zapata", "Zavala"],
  "Utah": ["Beaver", "Box Elder", "Cache", "Carbon", "Daggett", "Davis", "Duchesne", "Emery", "Garfield", "Grand", "Iron", "Juab", "Kane", "Millard", "Morgan", "Piute", "Rich", "Salt Lake", "San Juan", "Sanpete", "Sevier", "Summit", "Tooele", "Uintah", "Utah", "Wasatch", "Washington", "Wayne", "Weber"],
  "Vermont": ["Addison", "Bennington", "Caledonia", "Chittenden", "Essex", "Franklin", "Grand Isle", "Lamoille", "Orange", "Orleans", "Rutland", "Washington", "Windham", "Windsor"],
  "Virginia": ["Accomack", "Albemarle", "Alleghany", "Amelia", "Amherst", "Appomattox", "Arlington", "Augusta", "Bath", "Bedford", "Bland", "Botetourt", "Brunswick", "Buchanan", "Buckingham", "Campbell", "Caroline", "Carroll", "Charles City", "Charlotte", "Chesterfield", "Clarke", "Craig", "Culpeper", "Cumberland", "Dickenson", "Dinwiddie", "Essex", "Fairfax", "Fauquier", "Floyd", "Fluvanna", "Franklin", "Frederick", "Giles", "Gloucester", "Goochland", "Grayson", "Greene", "Greensville", "Halifax", "Hanover", "Henrico", "Henry", "Highland", "Isle of Wight", "James City", "King and Queen", "King George", "King William", "Lancaster", "Lee", "Loudoun", "Louisa", "Lunenburg", "Madison", "Mathews", "Mecklenburg", "Middlesex", "Montgomery", "Nelson", "New Kent", "Northampton", "Northumberland", "Nottoway", "Orange", "Page", "Patrick", "Pittsylvania", "Powhatan", "Prince Edward", "Prince George", "Prince William", "Pulaski", "Rappahannock", "Richmond", "Roanoke", "Rockbridge", "Rockingham", "Russell", "Scott", "Shenandoah", "Smyth", "Southampton", "Spotsylvania", "Stafford", "Surry", "Sussex", "Tazewell", "Warren", "Washington", "Westmoreland", "Wise", "Wythe", "York"],
  "Washington": ["Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia", "Cowlitz", "Douglas", "Ferry", "Franklin", "Garfield", "Grant", "Grays Harbor", "Island", "Jefferson", "King", "Kitsap", "Kittitas", "Klickitat", "Lewis", "Lincoln", "Mason", "Okanogan", "Pacific", "Pend Oreille", "Pierce", "San Juan", "Skagit", "Skamania", "Snohomish", "Spokane", "Stevens", "Thurston", "Wahkiakum", "Walla Walla", "Whatcom", "Whitman", "Yakima"],
  "West Virginia": ["Barbour", "Berkeley", "Boone", "Braxton", "Brooke", "Cabell", "Calhoun", "Clay", "Doddridge", "Fayette", "Gilmer", "Grant", "Greenbrier", "Hampshire", "Hancock", "Hardy", "Harrison", "Jackson", "Jefferson", "Kanawha", "Lewis", "Lincoln", "Logan", "McDowell", "Marion", "Marshall", "Mason", "Mercer", "Mineral", "Mingo", "Monongalia", "Monroe", "Morgan", "Nicholas", "Ohio", "Pendleton", "Pleasants", "Pocahontas", "Preston", "Putnam", "Raleigh", "Randolph", "Ritchie", "Roane", "Summers", "Taylor", "Tucker", "Tyler", "Upshur", "Wayne", "Webster", "Wetzel", "Wirt", "Wood", "Wyoming"],
  "Wisconsin": ["Adams", "Ashland", "Barron", "Bayfield", "Brown", "Buffalo", "Burnett", "Calumet", "Chippewa", "Clark", "Columbia", "Crawford", "Dane", "Dodge", "Door", "Douglas", "Dunn", "Eau Claire", "Florence", "Fond du Lac", "Forest", "Grant", "Green", "Green Lake", "Iowa", "Iron", "Jackson", "Jefferson", "Juneau", "Kenosha", "Kewaunee", "La Crosse", "Lafayette", "Langlade", "Lincoln", "Manitowoc", "Marathon", "Marinette", "Marquette", "Menominee", "Milwaukee", "Monroe", "Oconto", "Oneida", "Outagamie", "Ozaukee", "Pepin", "Pierce", "Polk", "Portage", "Price", "Racine", "Richland", "Rock", "Rusk", "St. Croix", "Sauk", "Sawyer", "Shawano", "Sheboygan", "Taylor", "Trempealeau", "Vernon", "Vilas", "Walworth", "Washburn", "Washington", "Waukesha", "Waupaca", "Waushara", "Winnebago", "Wood"],
  "Wyoming": ["Albany", "Big Horn", "Campbell", "Carbon", "Converse", "Crook", "Fremont", "Goshen", "Hot Springs", "Johnson", "Laramie", "Lincoln", "Natrona", "Niobrara", "Park", "Platte", "Sheridan", "Sublette", "Sweetwater", "Teton", "Uinta", "Washakie", "Weston"]
};

export function AddressSelect({ category,
  placeholdername,
  country,
  state,
  selectedValue,
  defultselect,
  wPage,
  className,
  disabled
}: Props) {
  React.useEffect(() => {
    setWPage(wPage!)
    if (!defultselect) {
      setValue("")
    }
    else {
      setValue(defultselect)
    }
  }, [defultselect])
  const [wpage, setWPage] = React.useState(200)
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defultselect)
  let options: string[] = [];
  if (category == "usStatesAndCities" && country !== "") {
    options = Object.keys(usStatesAndCities);
  } else if (category == "mexicoStatesAndCities" && country !== "") {
    options = Object.keys(mexicoStatesAndCities);
  } else if (category == "city") {
    if (country === "USA") {
      options = ["Select City"].concat(usStatesAndCities[state!] ? usStatesAndCities[state!].sort() : []);
    } else if (country === "Mexico") {
      options = ["Select City"].concat(mexicoStatesAndCities[state!] ? mexicoStatesAndCities[state!].sort() : []);
    }
  }else if(category === "county"){
    options = ["Select County"].concat(usa_states_counties[state!] ? usa_states_counties[state!].sort() : []);
  } else {
    options = []
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            `h-8 justify-between font-normal whitespace-nowrap text-xs ${wpage ? `w-[${wpage}px]` : 'w-[200px]'}`,
            className
          )}
        >
          {value
            ? value
            : placeholdername}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`h-[180px] p-0 ${wpage ? `w-[${wpage}px]` : 'w-[200px]'}`}>
        <Command className="dark:bg-slate-900">
          <CommandInput placeholder={placeholdername} className="h-8 text-xs" />
          <CommandEmpty>No option found</CommandEmpty>
          <CommandGroup className=" text-xs thin-scrollbar overflow-y-scroll dark:bg-slate-900" >
            {options?.map((framework) => (
              <CommandItem
                key={framework}
                value={framework}
                className="text-xs"
                onSelect={(currentValue) => {
                   currentValue = currentValue.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                  // currentValue = currentValue[0].toUpperCase() + currentValue.slice(1)
                  let cValue = value ? value[0]?.toUpperCase() + value?.slice(1) : " " ;
                  if (currentValue === "Select County" || currentValue === "Select City" || currentValue === "Select State") {
                    setValue(""); 
                    selectedValue(""); 
                  } else {
                    setValue(currentValue === cValue ? "" : currentValue);
                    selectedValue(currentValue === cValue ? "" : currentValue);
                  }
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
