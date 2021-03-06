import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDBContextService } from 'hooks/useDBContextService';
import { useAuth } from 'contexts/AuthContext';

import * as organizationService from 'services/organizationService';
import * as logger from 'utils/notifyingUX/logger';
import * as toaster from 'utils/notifyingUX/toaster';
import { consoleMessages, toastMessages } from 'utils/notifyingUX/UXmessages';
import * as loadingUX from 'utils/loadingUX/loadingUX';

import * as purchaseService from 'services/purchaseService';

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
                setOrgPurchases(() => orgPurchases.map(p => ({ ...p, toDisplay: !p.bought })));
                loadingUX.dimScreenOut();

            })
            .catch((err) => {
                // console.log(err);
                logger.logWarning(consoleMessages.ORG_PURCHASE_DATA_LOAD_FAIL);
                toaster.toastWarning(toastMessages.ORG_PURCHASE_DATA_LOAD_FAIL);
                loadingUX.dimScreenOut();

            })
    }

    const addPurchaseAndProduct = async (inputValues) => {

        try {
            const savedPurchase = await organizationService.addPurchaseToOrganization(inputValues, currentUserClaims.organizationId);
            savedPurchase.toDisplay = true;

            setOrgPurchases(orgPurchases => [...orgPurchases, savedPurchase]);
            return Promise.resolve(savedPurchase);
        } catch(err) {
            return Promise.reject(err);
        }

    }

    const buyPurchase = async (purchaseId) => {

        try {

            await purchaseService.buyOrganizationPurchase(currentUserClaims.organizationId, purchaseId);

            setOrgPurchases(orgPurchases => [...orgPurchases.map(p => {
                if(p._id === purchaseId) {
                    p.bought = true;

                    setTimeout(() => {
                        if(p.bought) {
                            p.toDisplay = false;
                            setOrgPurchases(() => orgPurchases);
                        }
                    }, 3600000)
                }
                return p;
            })])

            return Promise.resolve(purchaseId);

        } catch(err) {
            return Promise.reject(err);
        }
    }

    const rejectBoughtPurchase = async (purchaseId) => {

        try {
            await purchaseService.rejectOrganizationPurchase(currentUserClaims.organizationId, purchaseId);

            setOrgPurchases(orgPurchases => [...orgPurchases.map(p => {
                if(p._id === purchaseId) {
                    p.bought = false;
                    p.toDisplay = true;
                }
                return p;
            })])

            return Promise.resolve(purchaseId);

        } catch(err) {
            return Promise.reject(err);
        }
    }

    const globalData = {
        orgPurchases,
        setOrgPurchases,
        addPurchaseAndProduct,
        buyPurchase,
        rejectBoughtPurchase,
    }

    return (
        <PurchaseContext.Provider value={globalData}>
            {children}
        </PurchaseContext.Provider>
    )
}
