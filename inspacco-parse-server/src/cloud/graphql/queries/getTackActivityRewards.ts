export const GET_TASK_ACTIVITY_REWARD = `
query getReward($id: ID!) {
    taskActivity(id: $id) {
      task {
        rewardPoints
      }
    }
  }
  
`;