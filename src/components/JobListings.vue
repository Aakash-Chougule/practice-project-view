<script setup>
// Import necessary components and libraries
import JobListingSingular from './JobListingSingular.vue'; // Component to display each individual job listing
import { ref, reactive, onMounted, defineProps } from 'vue'; // Vue Composition API functions for state and lifecycle management
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'; // Loading spinner component to indicate data fetching
import axios from 'axios'; // HTTP client for making API requests

// Props to customize the component behavior
defineProps({
  limit: Number, // Limit for the number of jobs to be displayed initially (passed from parent)
  showButton: {
    type: Boolean,
    default: false, // Boolean to control whether the "Show More" button should appear (default is false)
  },
});

// Reactive state to manage jobs, loading state, and error messages
const state = reactive({
  jobs: [], // Array to store fetched job listings
  isLoading: true, // Flag to show loading spinner while fetching data
  error: null, // To store any error message encountered while fetching data
});

// Ref to control whether to show all jobs or just the limited number
const showAll = ref(false);

// Fetch the jobs data from the API when the component is mounted
onMounted(async () => {
  try {
    // Make an API call to fetch the job listings
    const response = await axios.get('/api/jobs');
    state.jobs = response.data; // Store the fetched jobs data in the reactive state
  } catch (error) {
    console.error('Error fetching jobs:', error); // Log any errors to the console for debugging
    state.error = 'Failed to load jobs. Please try again later.'; // Set an error message if the API request fails
  } finally {
    state.isLoading = false; // Set isLoading to false once the API request is finished (whether successful or not)
  }
});
</script>

<template>
  <!-- Main section containing the job listings -->
  <section class="bg-blue-50 px-4 py-10">
    <div class="">
      <!-- Title for the section -->
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">Browse Jobs</h2>

      <!-- Display loader spinner while jobs are being fetched -->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader /> <!-- Loading spinner component -->
      </div>

      <!-- Display error message if an error occurs during data fetching -->
      <div v-else-if="state.error" class="text-center text-red-500 py-6">
        {{ state.error }} <!-- Display the error message -->
      </div>

      <!-- Display job listings once they are successfully fetched -->
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <!-- Loop through the jobs and display each using JobListingSingular component -->
        <JobListingSingular
          v-for="job in state.jobs.slice(0, showAll ? state.jobs.length : limit)"
          :key="job.id" 
          :job="job" 
        />
      </div>
    </div>
  </section>

  <!-- Show More/Less Button: Only displayed if 'showButton' prop is true -->
  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <button
      @click="showAll = !showAll"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
    >
      <!-- Button text changes based on the value of 'showAll' -->
      {{ showAll ? 'Show Less' : 'View All Jobs' }}
    </button>
  </section>
</template>
