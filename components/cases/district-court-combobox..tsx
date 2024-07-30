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
  disabled?: boolean,
  defultselect?:string
  selectedValue: (value: string) => void;
}
interface ComboDataType {
    court: string,
  }
const districtCourts = [
    "Alabama Middle District Court Montgomery",
    "Alabama Middle District Court Dothan",
    "Alabama Middle District Court Opelika",
    "Alabama Northern District Court Florence",
    "Alabama Northern District Court Huntsville",
    "Alabama Northern District Court Decatur",
    "Alabama Northern District Court Birmingham",
    "Alabama Northern District Court Anniston",
    "Alabama Northern District Court Tuscaloosa",
    "Alabama Southern District Court Mobile",
    "Alaska District Court Anchorage",
    "Alaska District Court Fairbanks",
    "Alaska District Court Juneau",
    "Alaska District Court Ketchikan",
    "Alaska District Court Nome",
    "Arizona District Court Phoenix",
    "Arizona District Court Prescott",
    "Arizona District Court Tucson",
    "Arizona District Court Yuma",
    "Arizona District Court Flagstaff",
    "Arkansas Eastern District Court Little Rock",
    "Arkansas Eastern District Court Helena",
    "Arkansas Eastern District Court Jonesboro",
    "Arkansas Western District Court Texarkana",
    "Arkansas Western District Court El Dorado",
    "Arkansas Western District Court Fort Smith",
    "Arkansas Western District Court Harrison",
    "Arkansas Western District Court Fayetteville",
    "Arkansas Western District Court Hot Springs",
    "California Central District Court Riverside",
    "California Central District Court Los Angeles",
    "California Central District Court Santa Ana",
    "California Eastern District Court Fresno",
    "California Eastern District Court Redding",
    "California Eastern District Court Sacramento",
    "California Eastern District Court Bakersfield",
    "California Eastern District Court Yosemite",
    "California Northern District Court Eureka",
    "California Northern District Court Oakland",
    "California Northern District Court San Francisco",
    "California Northern District Court San Jose",
    "California Southern District Court San Diego",
    "California Southern District Court El Centro",
    "Colorado District Court Denver",
    "Colorado District Court Durango",
    "Colorado District Court Grand Junction",
    "Colorado District Court Colorado Springs",
    "Connecticut District Court Bridgeport",
    "Connecticut District Court Hartford",
    "Connecticut District Court New Haven",
    "Delaware District Court Wilmington",
    "District of Columbia District Court Washington",
    "Florida Middle District Court Fort Myers",
    "Florida Middle District Court Jacksonville",
    "Florida Middle District Court Ocala",
    "Florida Middle District Court Orlando",
    "Florida Middle District Court Tampa",
    "Florida Northern District Court Gainesville",
    "Florida Northern District Court Panama City",
    "Florida Northern District Court Pensacola",
    "Florida Northern District Court Tallahassee",
    "Florida Southern District Court Fort Lauderdale",
    "Florida Southern District Court Fort Pierce",
    "Florida Southern District Court Key West",
    "Florida Southern District Court Miami",
    "Florida Southern District Court West Palm Beach",
    "Georgia Middle District Court Athens",
    "Georgia Middle District Court Macon",
    "Georgia Middle District Court Columbus",
    "Georgia Middle District Court Albany",
    "Georgia Middle District Court Valdosta",
    "Georgia Northern District Court Gainesville",
    "Georgia Northern District Court Atlanta",
    "Georgia Northern District Court Rome",
    "Georgia Northern District Court Newnan",
    "Georgia Southern District Court Augusta",
    "Georgia Southern District Court Dublin",
    "Georgia Southern District Court Savannah",
    "Georgia Southern District Court Waycross",
    "Georgia Southern District Court Brunswick",
    "Georgia Southern District Court Statesboro",
    "Hawaii District Court Honolulu",
    "Idaho District Court Boise",
    "Idaho District Court Coeur d'Alene",
    "Idaho District Court Moscow",
    "Idaho District Court Pocatello",
    "Illinois Central District Court Urbana",
    "Illinois Central District Court Peoria",
    "Illinois Central District Court Rock Island",
    "Illinois Central District Court Springfield",
    "Illinois Northern District Court Chicago",
    "Illinois Northern District Court Rockford",
    "Illinois Southern District Court Benton",
    "Illinois Southern District Court East St. Louis",
    "Indiana Northern District Court Fort Wayne",
    "Indiana Northern District Court South Bend",
    "Indiana Northern District Court Hammond",
    "Indiana Northern District Court Lafayette",
    "Indiana Southern District Court Indianapolis",
    "Indiana Southern District Court Terre Haute",
    "Indiana Southern District Court Evansville",
    "Indiana Southern District Court New Albany",
    "Iowa Northern District Court Cedar Rapids",
    "Iowa Northern District Court Sioux City",
    "Iowa Southern District Court Des Moines",
    "Iowa Southern District Court Council Bluffs",
    "Iowa Southern District Court Davenport",
    "Kansas District Court Kansas City",
    "Kansas District Court Topeka",
    "Kansas District Court Wichita",
    "Kentucky Eastern District Court Ashland",
    "Kentucky Eastern District Court Covington",
    "Kentucky Eastern District Court Frankfort",
    "Kentucky Eastern District Court Lexington",
    "Kentucky Eastern District Court London",
    "Kentucky Eastern District Court Pikeville",
    "Kentucky Western District Court Bowling Green",
    "Kentucky Western District Court Louisville",
    "Kentucky Western District Court Owensboro",
    "Kentucky Western District Court Paducah",
    "Louisiana Eastern District Court New Orleans",
    "Louisiana Middle District Court Baton Rouge",
    "Louisiana Western District Court Alexandria",
    "Louisiana Western District Court Lafayette",
    "Louisiana Western District Court Lake Charles",
    "Louisiana Western District Court Monroe",
    "Louisiana Western District Court Shreveport",
    "Maine District Court Bangor",
    "Maine District Court Portland",
    "Maryland District Court Baltimore",
    "Maryland District Court Greenbelt",
    "Massachusetts District Court Boston",
    "Massachusetts District Court Springfield",
    "Massachusetts District Court Worcester",
    "Michigan Eastern District Court Ann Arbor",
    "Michigan Eastern District Court Detroit",
    "Michigan Eastern District Court Flint",
    "Michigan Eastern District Court Port Huron",
    "Michigan Eastern District Court Bay City",
    "Michigan Western District Court Grand Rapids",
    "Michigan Western District Court Kalamazoo",
    "Michigan Western District Court Lansing",
    "Michigan Western District Court Marquette",
    "Minnesota District Court Saint Paul",
    "Minnesota District Court Minneapolis",
    "Minnesota District Court Duluth",
    "Minnesota District Court Fergus Falls",
    "Mississippi Northern District Court Aberdeen",
    "Mississippi Northern District Court Oxford",
    "Mississippi Northern District Court Greenville",
    "Mississippi Southern District Court Jackson",
    "Mississippi Southern District Court Natchez",
    "Mississippi Southern District Court Gulfport",
    "Mississippi Southern District Court Hattiesburg",
    "Missouri Eastern District Court St. Louis",
    "Missouri Eastern District Court Hannibal",
    "Missouri Eastern District Court Cape Girardeau",
    "Missouri Western District Court Kansas City",
    "Missouri Western District Court Joplin",
    "Missouri Western District Court Saint Joseph",
    "Missouri Western District Court Jefferson City",
    "Missouri Western District Court Springfield",
    "Montana District Court Billings",
    "Montana District Court Butte",
    "Montana District Court Great Falls",
    "Montana District Court Helena",
    "Montana District Court Missoula",
    "Nebraska District Court Lincoln",
    "Nebraska District Court North Platte",
    "Nebraska District Court Omaha",
    "Nevada District Court Las Vegas",
    "Nevada District Court Reno",
    "New Hampshire District Court Concord",
    "New Jersey District Court Camden",
    "New Jersey District Court Newark",
    "New Jersey District Court Trenton",
    "New Mexico District Court Albuquerque",
    "New Mexico District Court Las Cruces",
    "New Mexico District Court Roswell",
    "New Mexico District Court Santa Fe",
    "New York Eastern District Court Brooklyn",
    "New York Eastern District Court Central Islip",
    "New York Northern District Court Albany",
    "New York Northern District Court Binghamton",
    "New York Northern District Court Plattsburgh",
    "New York Northern District Court Syracuse",
    "New York Northern District Court Utica",
    "New York Southern District Court New York",
    "New York Southern District Court White Plains",
    "New York Western District Court Buffalo",
    "New York Western District Court Rochester",
    "North Carolina Eastern District Court Elizabeth City",
    "North Carolina Eastern District Court Fayetteville",
    "North Carolina Eastern District Court Greenville",
    "North Carolina Eastern District Court New Bern",
    "North Carolina Eastern District Court Raleigh",
    "North Carolina Eastern District Court Wilmington",
    "North Carolina Middle District Court Durham",
    "North Carolina Middle District Court Greensboro",
    "North Carolina Middle District Court Winston-Salem",
    "North Carolina Western District Court Asheville",
    "North Carolina Western District Court Charlotte",
    "North Carolina Western District Court Statesville",
    "North Dakota District Court Bismarck",
    "North Dakota District Court Fargo",
    "North Dakota District Court Grand Forks",
    "North Dakota District Court Minot",
    "Ohio Northern District Court Cleveland",
    "Ohio Northern District Court Youngstown",
    "Ohio Northern District Court Akron",
    "Ohio Northern District Court Toledo",
    "Ohio Southern District Court Cincinnati",
    "Ohio Southern District Court Dayton",
    "Ohio Southern District Court Columbus",
    "Oklahoma Eastern District Court Muskogee",
    "Oklahoma Northern District Court Tulsa",
    "Oklahoma Western District Court Oklahoma City",
    "Oregon District Court Eugene",
    "Oregon District Court Medford",
    "Oregon District Court Pendleton",
    "Oregon District Court Portland",
    "Pennsylvania Eastern District Court Allentown",
    "Pennsylvania Eastern District Court Easton",
    "Pennsylvania Eastern District Court Reading",
    "Pennsylvania Eastern District Court Philadelphia",
    "Pennsylvania Middle District Court Harrisburg",
    "Pennsylvania Middle District Court Scranton",
    "Pennsylvania Middle District Court Wilkes-Barre",
    "Pennsylvania Middle District Court Williamsport",
    "Pennsylvania Western District Court Erie",
    "Pennsylvania Western District Court Johnstown",
    "Pennsylvania Western District Court Pittsburgh",
    "Puerto Rico District Court San Juan",
    "Rhode Island District Court Providence",
    "South Carolina District Court Charleston",
    "South Carolina District Court Columbia",
    "South Carolina District Court Florence",
    "South Carolina District Court Aiken",
    "South Carolina District Court Greenville",
    "South Carolina District Court Anderson",
    "South Carolina District Court Spartanburg",
    "South Dakota District Court Aberdeen",
    "South Dakota District Court Sioux Falls",
    "South Dakota District Court Pierre",
    "South Dakota District Court Rapid City",
    "Tennessee Eastern District Court Knoxville",
    "Tennessee Eastern District Court Greeneville",
    "Tennessee Eastern District Court Chattanooga",
    "Tennessee Eastern District Court Winchester",
    "Tennessee Middle District Court Nashville",
    "Tennessee Middle District Court Cookeville",
    "Tennessee Middle District Court Columbia",
    "Tennessee Western District Court Jackson",
    "Tennessee Western District Court Memphis",
    "Texas Eastern District Court Tyler",
    "Texas Eastern District Court Beaumont",
    "Texas Eastern District Court Sherman",
    "Texas Eastern District Court Marshall",
    "Texas Eastern District Court Texarkana",
    "Texas Eastern District Court Lufkin",
    "Texas Northern District Court Dallas",
    "Texas Northern District Court Fort Worth",
    "Texas Northern District Court Abilene",
    "Texas Northern District Court San Angelo",
    "Texas Northern District Court Amarillo",
    "Texas Northern District Court Wichita Falls",
    "Texas Northern District Court Lubbock",
    "Texas Southern District Court Galveston",
    "Texas Southern District Court Houston",
    "Texas Southern District Court Laredo",
    "Texas Southern District Court Brownsville",
    "Texas Southern District Court Victoria",
    "Texas Southern District Court Corpus Christi",
    "Texas Southern District Court McAllen",
    "Texas Western District Court Austin",
    "Texas Western District Court Waco",
    "Texas Western District Court El Paso",
    "Texas Western District Court San Antonio",
    "Texas Western District Court Del Rio",
    "Texas Western District Court Pecos",
    "Texas Western District Court Midland",
    "Texas Western District Court Alpine",
    "Texas Western District Court Fort Hood",
    "Utah District Court Salt Lake City",
    "Utah District Court St. George",
    "Vermont District Court Brattleboro",
    "Vermont District Court Burlington",
    "Vermont District Court Rutland",
    "Virginia Eastern District Court Alexandria",
    "Virginia Eastern District Court Newport News",
    "Virginia Eastern District Court Norfolk",
    "Virginia Eastern District Court Richmond",
    "Virginia Western District Court Abingdon",
    "Virginia Western District Court Big Stone Gap",
    "Virginia Western District Court Charlottesville",
    "Virginia Western District Court Danville",
    "Virginia Western District Court Harrisonburg",
    "Virginia Western District Court Lynchburg",
    "Virginia Western District Court Roanoke",
    "Washington Eastern District Court Spokane",
    "Washington Eastern District Court Yakima",
    "Washington Eastern District Court Richland",
    "Washington Western District Court Seattle",
    "Washington Western District Court Tacoma",
    "West Virginia Northern District Court Clarksburg",
    "West Virginia Northern District Court Elkins",
    "West Virginia Northern District Court Martinsburg",
    "West Virginia Northern District Court Wheeling",
    "West Virginia Southern District Court Beckley",
    "West Virginia Southern District Court Bluefield",
    "West Virginia Southern District Court Charleston",
    "West Virginia Southern District Court Huntington",
    "Wisconsin Eastern District Court Green Bay",
    "Wisconsin Eastern District Court Milwaukee",
    "Wisconsin Western District Court Madison",
    "Wyoming District Court Casper",
    "Wyoming District Court Cheyenne",
    "Wyoming District Court Mammoth"
  ];
  
  export function ComboboxCourts({ disabled, selectedValue, defultselect }: Props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
  
    React.useEffect(() => {
        if (!defultselect) {
          setValue("")
        }
        else {
          setValue(defultselect)
        }
      }, [defultselect])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              `h-8 justify-between whitespace-nowrap font-normal text-xs w-[270px] md:w-[320px] select-custom disabled:cursor-text disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0`
            )}
          >
            <div className={`max-w-[320px] overflow-hidden text-ellipsis whitespace-nowrap"
                          }`}>
            {value || "Select court"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`h-[180px] p-0 w-[310px]`}>
          <Command className="dark:bg-slate-900">
            <CommandInput placeholder="Search court" className="h-8 text-xs" />
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup className="text-xs thin-scrollbar overflow-y-scroll dark:bg-slate-900">
              {districtCourts?.map((framework: any,i) => (
                <CommandItem
                  key={i}
                  value={framework}
                  className="text-xs"
                  onSelect={(currentValue) => {
                    setValue(framework);
                    selectedValue(framework)
                    setOpen(false);
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
    );
  }
  
