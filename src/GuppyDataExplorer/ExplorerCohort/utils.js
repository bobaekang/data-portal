import { fetchWithCreds } from '../../actions';
import { capitalizeFirstLetter } from '../../utils';
import { getGQLFilter } from '@pcdc/guppy/dist/components/Utils/queries';
import './typedef';

const COHORT_URL = '/amanuensis/cohort';

/**
 * @returns {Promise<ExplorerCohort[]>}
 */
export function fetchCohorts() {
  return fetchWithCreds({
    path: COHORT_URL,
    method: 'GET',
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    if (
      data === null ||
      typeof data !== 'object' ||
      !data.hasOwnProperty('searches') ||
      !Array.isArray(data.searches)
    )
      throw 'Error: Incorrect Response Data';
    return data.searches;
  });
}

/**
 * @param {ExplorerCohort} cohort
 * @returns {Promise<ExplorerCohort>}
 */
export function saveCohort(cohort) {
  return fetchWithCreds({
    path: COHORT_URL,
    method: 'POST',
    body: JSON.stringify(cohort),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}

/**
 * @param {ExplorerCohort} cohort
 */
export function updateCohort(cohort) {
  const { id, ...requestBody } = cohort;
  return fetchWithCreds({
    path: `${COHORT_URL}/${id}`,
    method: 'PUT',
    body: JSON.stringify(requestBody),
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @param {ExplorerCohort} cohort
 */
export function deleteCohort(cohort) {
  return fetchWithCreds({
    path: `${COHORT_URL}/${cohort.id}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @param {string} commons
 * @param {ExplorerFilters} filters
 */
export function fetchFindCohortRedirectUrl(commons, filters) {
  return fetchWithCreds({
    path: `/analysis/tools/${commons}`,
    method: 'POST',
    body: JSON.stringify({ filter: getGQLFilter(filters) }),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}

/**
 * @return {ExplorerCohort}
 */
export function createEmptyCohort() {
  return {
    name: '',
    description: '',
    filters: {},
  };
}

/**
 * @param {string} string
 * @param {number} maxLength
 */
export function truncateWithEllipsis(string, maxLength) {
  return string.length > maxLength
    ? string.slice(0, maxLength - 3) + '...'
    : string;
}

/**
 * @param {ExplorerFilters} filters
 */
export function stringifyFilters(filters) {
  if (Object.keys(filters).length == 0) return '';

  let filterStr = '';
  for (const [key, value] of Object.entries(filters)) {
    filterStr += `* ${capitalizeFirstLetter(key)}\n`;
    if (value.hasOwnProperty('selectedValues'))
      for (const selected of value.selectedValues)
        filterStr += `\t- '${selected}'\n`;
    else
      filterStr += `\t- from: ${value.lowerBound}\n\t- to: ${value.upperBound}\n`;
  }

  return filterStr;
}
