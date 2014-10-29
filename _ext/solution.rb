require 'json'

module JBoss
  module Developer
    module Extensions
      # Post-process solution metadata from solution.yml, applying conventions
      class Solution

        def initialize

        end

        def execute(site)

          puts "Solutions..."

          site.technology_solutions = {}
          site.pages.each do |page|
            if !page.solution.nil? && page.relative_source_path.start_with?('/solutions')
              solution = page.solution
              solution.id = page.parent_dir
              puts solution.id
              site.technology_solutions[solution.id] = solution
            end
          end
          puts site.technology_solutions.values
        end
      end

    end
  end
end
