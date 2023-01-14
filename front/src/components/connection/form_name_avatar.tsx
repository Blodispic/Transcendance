import React, { useState } from 'react';

const NameForm = () => {

    return (
        <form>
            <label>
                Name:
                <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default NameForm;
