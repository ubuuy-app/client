import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDBContextService } from 'hooks/useDBContextService';
import { useAuth } from 'contexts/AuthContext';

import * as organizationService from 'services/organizationService';
import * as logger from 'utils/notifyingUX/logger';
import * as toaster from 'utils/notifyingUX/toaster';
import { consoleMessages, toastMessages } from 'utils/notifyingUX/UXmessages';

const PurchaseContext = React.createContext();
export const usePurchaseContext = () => { return useContext(PurchaseContext) };

export const PurchaseContextProvider = (
    { children }
) => {

    const { currentUserClaims } = useAuth();
    const [fetchPurchaseDataByRole] = useDBContextService();
    const location = useLocation();


    /* APPLICATION DATA */
    const [orgPurchases, setOrgPurchases] = useState(null);

    useEffect(() => {
        refreshDataFromDB();
    }, [])

    useEffect(() => {
        if(location.pathname === '/profile/purchases') {
            refreshDataFromDB();
        }
    }, [location.pathname]);

    const refreshDataFromDB = () => {
        fetchPurchaseDataByRole(currentUserClaims)
            .then(([orgPurchases]) => {
                setOrgPurchases(orgPurchases);
            })
            .catch((err) => {
                // console.log(err);
                logger.logWarning(consoleMessages.ORG_PURCHASE_DATA_LOAD_FAIL);
                toaster.toastWarning(toastMessages.ORG_PURCHASE_DATA_LOAD_FAIL);
            })
    }

    const addPurchaseAndProduct = async (inputValues) => {

        try {
            const savedPurchase =
                await organizationService.addPurchaseToOrganization(inputValues, currentUserClaims.organizationId);

            setOrgPurchases(orgPurchases => [...orgPurchases, savedPurchase]);
            return Promise.resolve(savedPurchase);
        } catch(err) {
            return Promise.reject(err);
        }

    }

    const globalData = {
        orgPurchases,
        setOrgPurchases,
        addPurchaseAndProduct,
    }

    return (
        <PurchaseContext.Provider value={globalData}>
            {children}
        </PurchaseContext.Provider>
    )
}
