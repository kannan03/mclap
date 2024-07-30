import axiosInstance from "@/config/axios/axiosClientInterceptorInstance";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const fetchRolesData = async () => {
    try {
      const rolesInStorage = sessionStorage.getItem("roles");
      let roleDetails = null
      if (rolesInStorage !== null) {
        roleDetails = JSON.parse(rolesInStorage);
      } else {
        const response = await axiosInstance.get(baseURL + "/v1/roles");
        roleDetails = response?.data?.roles?.rows;
        if (roleDetails !== null && roleDetails !== undefined && roleDetails.length>0) {
          sessionStorage.setItem("roles", JSON.stringify(roleDetails));
        }     
      }
      return roleDetails;
    } catch (error) {
      console.error((error as any).message);
    }
  }

  export const fetchOrganizationTypeData = async () => {
    try {
      const orgTypeDataInStorage = sessionStorage.getItem("Orgstype");
      let orgTypeDetails = null;
  
      if (orgTypeDataInStorage !== null) {
        orgTypeDetails = JSON.parse(orgTypeDataInStorage);
      } else {
        const response = await axiosInstance.get(
          baseURL + "/v1/orgsType/allOrganizationsTypes"
        );
        orgTypeDetails = response?.data?.organizationsType?.rows;
        if (orgTypeDetails !== null && orgTypeDetails !== undefined && orgTypeDetails.length>0) {
          sessionStorage.setItem("Orgstype", JSON.stringify(orgTypeDetails));
        }
      }
      return orgTypeDetails;
    } catch (error) {
      console.error("Error fetching organization type data:", (error as any).message);
    }
  };

 export const fetchStateData = async () => {
    try {
      const stateDataInStorage = sessionStorage.getItem("stateValueData");
      let stateValue = null;
  
      if (stateDataInStorage !== null) {
        stateValue = JSON.parse(stateDataInStorage);
      } else {
        const response = await axiosInstance.get(
          baseURL + "/v1/lookUpValue/allStates"
        );
        stateValue = response?.data?.states?.rows;
        if (stateValue !== null && stateValue !== undefined && stateValue.length>0) {
          sessionStorage.setItem("stateValueData", JSON.stringify(stateValue));
        }
      }
     return stateValue;
    } catch (error) {
      console.error("Error fetching state data:", (error as any).message);
    }
  };
