export function extractQueryParams(query) {
    return query.substr(1).split('$').reduce((queryParams, param) => {
        const [key, value] = param.splite('=')
        queryParams[key] = value

        return queryParams
    }, {})
}