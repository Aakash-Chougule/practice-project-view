<script setup>
  // Importing necessary dependencies
  import BackButton from '@/components/BackButton.vue';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'; // Loader component
  import { reactive, onMounted } from 'vue'; // reactive for state management and onMounted lifecycle hook
  import { useRoute, useRouter } from 'vue-router'; // Access the route and router for navigation
  import axios from 'axios'; // Axios for making HTTP requests
  import { useToast } from 'vue-toastification';  // Toast notification library

  // Initialize route and router
  const route = useRoute(); // Access route parameters
  const router = useRouter(); // To navigate programmatically after deleting a job
  const toast = useToast(); // Access toast notification functionality
  const jobId = route.params.id; // Get the job ID from the URL parameters

  // Reactive state to store job details and loading/error states
  const state = reactive({
    job: {}, // Holds the job data fetched from the API
    isLoading: true, // Tracks loading state while fetching the data
    error: null, // Tracks any error that occurs during data fetching
  });

  // Lifecycle hook to fetch job data once the component is mounted
  onMounted(async () => {
    try {
      // Making a GET request to fetch the job details using the job ID
      const response = await axios.get(`/api/jobs/${jobId}`);
      state.job = response.data; // Store the fetched data into the state
    } catch (error) {
      console.error('Error fetching job:', error); // Log any errors for debugging
      state.error = 'Unable to load job details. Please try again later.'; // Set error message if request fails
    } finally {
      state.isLoading = false; // Set loading state to false once the request completes (either success or failure)
    }
  });

  // Function to delete the job
  const deleteJob = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this job?'); // Confirm if user wants to delete
    if (!confirmDelete) return; // If user cancels, do nothing

    try {
      // Making a DELETE request to remove the job using its ID
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success('Job deleted successfully!'); // Show success toast notification after deletion
      router.push('/jobs'); // Navigate to the job list page after deletion
    } catch (error) {
      console.error('Error deleting job:', error); // Log any errors during deletion
      toast.error('Error deleting job. Please try again later.'); // Show error toast notification during deletion
    }
  };
</script>

<template>

  <BackButton />
  <!-- Main content section: only visible when data is loaded and there's no error -->
  <section v-if="!state.isLoading && !state.error" class="bg-green-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <!-- Main Content: Displays job details -->
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <!-- Job type -->
            <div class="text-gray-500 mb-4">{{ state.job.type }}</div>
            <!-- Job title -->
            <h1 class="text-3xl font-bold mb-4">{{ state.job.title }}</h1>
            <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
              <!-- Location icon and location -->
              <i class="pi pi-map-marker text-xl text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ state.job.location }}</p>
            </div>
          </div>

          <!-- Job description and salary -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-green-800 text-lg font-bold mb-6">Job Description</h3>
            <p class="mb-4">{{ state.job.description }}</p>

            <h3 class="text-green-800 text-lg font-bold mb-2">Salary</h3>
            <p class="mb-4">{{ state.job.salary }} / Year</p>
          </div>
        </main>

        <!-- Sidebar: Company info and job management -->
        <aside>
          <!-- Company Info -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-6">Company Info</h3>
            <h2 class="text-2xl">{{ state.job.company?.name }}</h2> <!-- Company name -->
            <p class="my-2">{{ state.job.company?.description }}</p> <!-- Company description -->
            <hr class="my-4" />
            <h3 class="text-xl">Contact Email:</h3>
            <p class="my-2 bg-green-100 p-2 font-bold">{{ state.job.company?.contactEmail }}</p> <!-- Company email -->
            <h3 class="text-xl">Contact Phone:</h3>
            <p class="my-2 bg-green-100 p-2 font-bold">{{ state.job.company?.contactPhone }}</p> <!-- Company phone -->
          </div>

          <!-- Manage Job: Edit and delete buttons -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage Job</h3>
            <RouterLink
              :to="`/jobs/edit/${state.job.id}`"
              class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Edit Job
            </RouterLink> <!-- Edit job button -->
            <button
              @click="deleteJob"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete Job
            </button> <!-- Delete job button -->
          </div>
        </aside>
      </div>
    </div>
  </section>

  <!-- Error message section, shown when there's an error loading the job -->
  <div v-else-if="state.error" class="text-center text-red-500 py-6">
    {{ state.error }}
  </div>

  <!-- Loading spinner, shown while job data is loading -->
  <div v-else class="text-center text-gray-500 py-6">
    <PulseLoader />
  </div>
</template>
