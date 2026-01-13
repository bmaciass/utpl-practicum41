import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectMutationsRef = builder.objectRef('project')

export const ProjectMutations = builder.objectType(ProjectMutationsRef, {
  name: 'ProjectMutations',
  description: 'Project mutations',
})

builder.mutationField('project', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectMutationsRef,
  }),
)
