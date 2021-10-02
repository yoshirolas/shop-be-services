
module.exports.invoke = async (event) => {
    try {
        const { Records } = event;
        for (const record of Records) {
            console.log(JSON.parse(record.body));
        }

    } catch (error) {
        console.log(error)
    }
};