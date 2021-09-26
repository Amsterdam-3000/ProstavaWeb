import React, { useEffect } from "react";

import { useProtectedMutation } from "../../app/services/prostava";

export const EmptyPage = () => {
    const [test, { data, error }] = useProtectedMutation();

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
    });

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">
                    <button onClick={() => test()}></button>
                    <h5>Empty Page</h5>
                    <p>
                        Use this page to start from scratch and place your custom content.
                        {data ? JSON.stringify(data) : JSON.stringify(error)}
                    </p>
                </div>
            </div>
        </div>
    );
};
